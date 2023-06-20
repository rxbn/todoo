import { useEffect, useRef, useState } from "react";
import {
  FaCalendar,
  FaCheck,
  FaPencilAlt,
  FaRegCircle,
  FaSave,
  FaTag,
  FaTimesCircle,
} from "react-icons/fa";
import { type RouterOutputs, api } from "~/utils/api";
import { TagList } from "./TagList";
import { DueDate } from "./DueDate";
import { DeleteConfirmation } from "./DeleteConfirmation";

type Todo = RouterOutputs["todos"]["get"][number];
type Tag = RouterOutputs["tags"]["getByTodo"][number];
export const TodoItem = (props: Todo) => {
  const [edit, setEdit] = useState(false);
  const [input, setInput] = useState(props.content);
  const [dueDate, setDueDate] = useState(props.dueDate);
  const [tags, setTags] = useState(props.tags);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDateChange = (newDate: string) => {
    setDueDate(newDate);
  };

  const ctx = api.useContext();

  const { mutate: toggleDone } = api.todos.toggleDone.useMutation({
    onSuccess: () => {
      void ctx.todos.get.invalidate();
    },
  });

  const handleTagChange = (newTags: Tag[]) => {
    setTags(newTags);
  };

  const { mutate: editTodo } = api.todos.edit.useMutation({
    onSuccess: () => {
      void ctx.todos.get.invalidate();
      void ctx.tags.getAll.invalidate();
    },
  });

  useEffect(() => {
    if (edit && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [edit]);

  return (
    <div className="flex justify-center">
      <ul className="w-full max-w-lg">
        <li className="border-b-2 border-blue-500 py-2">
          <div className="flex items-center">
            <input
              className={`mr-3 w-full appearance-none border-none bg-transparent px-2 py-1 leading-tight text-white focus:outline-none ${
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
                  if (input !== "") {
                    editTodo({ id: props.id, content: input, dueDate, tags });
                    if (inputRef.current) {
                      inputRef.current.setSelectionRange(
                        inputRef.current.value.length,
                        inputRef.current.value.length
                      );
                    }
                    setEdit(false);
                  }
                }
              }}
              readOnly={!edit}
            />
            <button
              className="mr-2 flex-shrink-0 rounded border-4 border-gray-500 bg-gray-500 px-2 py-1 text-sm text-white transition-colors duration-200 hover:border-gray-700 hover:bg-gray-700"
              type="button"
              hidden={props.done || edit}
              onClick={() => {
                setEdit(true);
              }}
            >
              <FaPencilAlt />
            </button>
            <TagList
              hidden={!edit}
              todoTags={tags}
              onTagChange={handleTagChange}
            />
            <DueDate
              hidden={!edit}
              dueDate={dueDate}
              onDateChange={handleDateChange}
            />
            <button
              className="flex-shrink-0 rounded border-4 border-green-500 bg-green-500 px-2 py-1 text-sm text-white transition-colors duration-200 hover:border-green-700 hover:bg-green-700"
              type="button"
              onClick={() => {
                if (input !== "") {
                  editTodo({ id: props.id, content: input, dueDate, tags });
                  setEdit(false);
                }
              }}
              hidden={!edit}
            >
              <FaSave />
            </button>
            <button
              className="flex-shrink-0 rounded border-4 border-green-500 bg-green-500 px-2 py-1 text-sm text-white transition-colors duration-200 hover:border-green-700 hover:bg-green-700"
              type="button"
              onClick={() => toggleDone({ id: props.id, done: true })}
              hidden={props.done || edit}
            >
              <FaCheck />
            </button>
            <button
              className="mr-2 flex-shrink-0 rounded border-4 border-green-500 bg-green-500 px-2 py-1 text-sm text-white transition-colors duration-200 hover:border-green-700 hover:bg-green-700"
              type="button"
              onClick={() => toggleDone({ id: props.id, done: false })}
              hidden={!props.done}
            >
              <FaRegCircle />
            </button>
            <DeleteConfirmation hidden={!props.done} id={props.id} />
          </div>
          {((tags && tags.length > 0) || dueDate) && !props.done ? (
            <div className="mt-2 flex flex-wrap px-2 text-sm text-slate-400">
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
                      className="ml-0.5"
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
                      className="ml-0.5"
                      onClick={() => setDueDate("")}
                    />
                  )}
                </div>
              )}
            </div>
          ) : null}
        </li>
      </ul>
    </div>
  );
};
