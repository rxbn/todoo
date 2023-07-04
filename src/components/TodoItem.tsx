import { useEffect, useRef, useState } from "react";
import {
  FaCalendar,
  FaCheck,
  FaPencilAlt,
  FaRegCircle,
  FaSave,
  FaTag,
  FaTimesCircle,
  FaTrashAlt,
} from "react-icons/fa";
import { type RouterOutputs, api } from "~/utils/api";
import { TagList } from "./TagList";
import { DueDate } from "./DueDate";
import toast from "react-hot-toast";
import { LoadingSpinner } from "./Loading";

type Todo = RouterOutputs["todos"]["get"][number];
type Tag = RouterOutputs["tags"]["getByTodo"][number];
export const TodoItem = (props: Todo) => {
  const [edit, setEdit] = useState(false);
  const [input, setInput] = useState(props.content);
  const [dueDate, setDueDate] = useState(props.dueDate);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showTagList, setShowTagList] = useState(false);
  const [showDueDate, setShowDueDate] = useState(false);

  const handleShowTagListChange = (newShow: boolean) => {
    setShowTagList(newShow);
  };
  const handleShowDueDateChange = (newShow: boolean) => {
    setShowDueDate(newShow);
  };
  const handleDateChange = (newDate: string) => {
    setDueDate(newDate);
  };
  const handleTagChange = (newTags: Tag[]) => {
    setTags(newTags);
  };

  const ctx = api.useContext();

  const [tags, setTags] = useState<Tag[]>();
  const { data: todoTags } = api.tags.getByTodo.useQuery({
    todoId: props.id,
  });

  useEffect(() => {
    if (todoTags) {
      setTags(todoTags);
    }
  }, [todoTags]);

  useEffect(() => {
    if (edit && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [edit]);

  const { mutate: toggleDone, isLoading: isToggleLoading } =
    api.todos.toggleDone.useMutation({
      onSuccess: () => {
        void ctx.todos.get.invalidate();
      },
    });

  const { mutate: editTodo, isLoading: isEditing } = api.todos.edit.useMutation(
    {
      onSuccess: () => {
        void ctx.todos.get.invalidate();
        void ctx.tags.getAll.invalidate();
        void ctx.tags.getByTodo.invalidate();
      },
    }
  );

  const { mutate: deleteTodo, isLoading: isDeleting } =
    api.todos.delete.useMutation({
      onSuccess: () => {
        void ctx.todos.get.invalidate();
      },
    });

  if (!tags) return null;
  return (
    <ul>
      <li className="border-b-2 border-blue-500 py-2">
        <div className="flex items-center">
          <input
            className={`mr-3 w-full appearance-none border-none bg-transparent px-2 py-1 leading-tight focus:outline-none ${
              props.done ? "line-through" : ""
            }`}
            type="text"
            value={input}
            spellCheck={false}
            aria-label={props.content}
            ref={inputRef}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (input.trim() === "") {
                  toast.error("Todo can't be empty");
                  setInput("");
                  return;
                }

                editTodo({
                  id: props.id,
                  content: input.trim(),
                  dueDate,
                  tags: tags.map((tag) => tag.id),
                });

                if (inputRef.current) {
                  inputRef.current.setSelectionRange(
                    inputRef.current.value.length,
                    inputRef.current.value.length
                  );
                }
                setInput(input.trim());
                setEdit(false);
              }
            }}
            disabled={isEditing}
            readOnly={!edit}
          />
          {(isEditing || isToggleLoading || isDeleting) && (
            <div className="mr-2 flex items-center justify-center">
              <LoadingSpinner size={20} />
            </div>
          )}
          <button
            className="mr-2 flex-shrink-0 rounded border-4 border-gray-500 bg-gray-500 px-2 py-1 text-sm text-white outline-none transition-colors duration-200 hover:border-gray-700 hover:bg-gray-700"
            type="button"
            hidden={props.done || edit}
            onClick={() => {
              setEdit(true);
            }}
          >
            <FaPencilAlt />
          </button>
          <button
            className=" mr-2 flex-shrink-0 rounded border-4 border-slate-500 bg-slate-500 px-2 py-1 text-sm text-white outline-none transition-colors duration-200 hover:border-slate-700 hover:bg-slate-700"
            type="button"
            hidden={!edit}
            onClick={() => setShowTagList(true)}
          >
            <FaTag />
          </button>
          <TagList
            show={showTagList}
            todoTags={tags}
            onTagChange={handleTagChange}
            onShowChange={handleShowTagListChange}
          />
          <button
            className="mr-2 flex-shrink-0 rounded border-4 border-orange-500 bg-orange-500 px-2 py-1 text-sm text-white outline-none transition-colors duration-200 hover:border-orange-700 hover:bg-orange-700"
            type="button"
            hidden={!edit}
            onClick={() => setShowDueDate(true)}
          >
            <FaCalendar />
          </button>
          <DueDate
            show={showDueDate}
            dueDate={dueDate}
            onDateChange={handleDateChange}
            onShowChange={handleShowDueDateChange}
          />
          <button
            className="flex-shrink-0 rounded border-4 border-green-500 bg-green-500 px-2 py-1 text-sm text-white outline-none transition-colors duration-200 hover:border-green-700 hover:bg-green-700"
            type="button"
            disabled={isEditing}
            onClick={() => {
              if (input.trim() === "") {
                toast.error("Todo can't be empty");
                setInput("");
                return;
              }

              editTodo({
                id: props.id,
                content: input.trim(),
                dueDate,
                tags: tags.map((tag) => tag.id),
              });
              setInput(input.trim());
              setEdit(false);
            }}
            hidden={!edit}
          >
            <FaSave />
          </button>
          <button
            className="flex-shrink-0 rounded border-4 border-green-500 bg-green-500 px-2 py-1 text-sm text-white outline-none transition-colors duration-200 hover:border-green-700 hover:bg-green-700"
            type="button"
            disabled={isToggleLoading}
            onClick={() => toggleDone({ id: props.id, done: true })}
            hidden={props.done || edit}
          >
            <FaCheck />
          </button>
          <button
            className="mr-2 flex-shrink-0 rounded border-4 border-green-500 bg-green-500 px-2 py-1 text-sm text-white outline-none transition-colors duration-200 hover:border-green-700 hover:bg-green-700"
            type="button"
            disabled={isToggleLoading}
            onClick={() => toggleDone({ id: props.id, done: false })}
            hidden={!props.done}
          >
            <FaRegCircle />
          </button>
          <button
            className="flex-shrink-0 rounded border-4 border-red-500 bg-red-500 px-2 py-1 text-sm text-white outline-none transition-colors duration-200 hover:border-red-700 hover:bg-red-700"
            type="button"
            disabled={isDeleting}
            onClick={() => deleteTodo({ id: props.id })}
            hidden={!props.done}
          >
            <FaTrashAlt />
          </button>
        </div>
        {((tags && tags.length > 0) || dueDate) && !props.done ? (
          <div className="mt-2 flex flex-wrap px-2 text-sm">
            {tags && tags.length > 0 && (
              <div className="mb-0.5 mr-2 flex flex-wrap items-center">
                <FaTag className="mr-0.5" />
                {tags &&
                  tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="m-0.5 ml-0.5 rounded-md bg-slate-500 p-0.5 text-white"
                    >
                      {tag.name}
                    </span>
                  ))}
                {edit && (
                  <FaTimesCircle
                    className="ml-0.5 cursor-pointer rounded-full transition-colors duration-200 hover:border-red-500 hover:bg-red-500"
                    onClick={() => setTags([])}
                  />
                )}
              </div>
            )}
            {dueDate && (
              <div className="mb-0.5 flex items-center">
                <FaCalendar className="mr-0.5" />
                <span className="rounded-md bg-orange-500 p-0.5 text-white">
                  {dueDate}
                </span>
                {edit && (
                  <FaTimesCircle
                    className="ml-0.5 cursor-pointer rounded-full transition-colors duration-200 hover:border-red-500 hover:bg-red-500"
                    onClick={() => setDueDate("")}
                  />
                )}
              </div>
            )}
          </div>
        ) : null}
      </li>
    </ul>
  );
};
