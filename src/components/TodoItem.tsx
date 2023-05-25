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

type Todo = RouterOutputs["todos"]["get"][number];
export const TodoItem = (props: Todo) => {
  const [edit, setEdit] = useState(false);
  const [input, setInput] = useState(props.content);
  const [dueDate, setDueDate] = useState(props.dueDate || undefined);
  const [calendar, showCalendar] = useState(false);
  const [tags, setTags] = useState(props.tags || undefined);
  const [tagList, showTagList] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const ctx = api.useContext();

  const { mutate: toggleDone } = api.todos.toggleDone.useMutation({
    onSuccess: () => {
      void ctx.todos.get.invalidate();
    },
  });

  const { mutate: editTodo } = api.todos.edit.useMutation({
    onSuccess: () => {
      void ctx.todos.get.invalidate();
    },
  });

  const { mutate: deleteTodo } = api.todos.delete.useMutation({
    onSuccess: () => {
      void ctx.todos.get.invalidate();
    },
  });

  const calendarRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node)
      ) {
        showCalendar(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendarRef]);

  const tagListRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        tagListRef.current &&
        !tagListRef.current.contains(e.target as Node)
      ) {
        showTagList(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [tagListRef]);

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
              className={`mr-3 w-full appearance-none border-none bg-transparent px-2 py-1 leading-tight text-gray-400 focus:outline-none ${
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
            <div className="relative inline-flex">
              <button
                className="mr-2 flex-shrink-0 rounded border-4 border-slate-500 bg-slate-500 px-2 py-1 text-sm text-white transition-colors duration-200 hover:border-slate-700 hover:bg-slate-700"
                type="button"
                hidden={!edit}
                onClick={() => showTagList(true)}
              >
                <FaTag />
              </button>
              {tagList && (
                <div
                  ref={tagListRef}
                  className="absolute left-0 top-full mt-2 rounded-md border border-slate-600 bg-slate-400 p-4 text-black shadow-lg"
                >
                  <span className="px-2 py-1 leading-tight">Set tags:</span>
                  <input
                    className="w-48 appearance-none border-none bg-slate-500 px-2 py-1 leading-tight focus:outline-none"
                    type="text"
                    aria-label="Set tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (tags !== "") {
                          showTagList(false);
                        }
                      }
                    }}
                  />
                </div>
              )}
            </div>
            <div className="relative inline-flex">
              <button
                className="mr-2 flex-shrink-0 rounded border-4 border-orange-500 bg-orange-500 px-2 py-1 text-sm text-white transition-colors duration-200 hover:border-orange-700 hover:bg-orange-700"
                type="button"
                hidden={!edit}
                onClick={() => showCalendar(true)}
              >
                <FaCalendar />
              </button>
              {calendar && (
                <div
                  ref={calendarRef}
                  className="absolute left-0 top-full mt-2 rounded-md border border-slate-600 bg-slate-400 p-4 text-black shadow-lg"
                >
                  <span className="px-2 py-1 leading-tight">Set due date:</span>
                  <input
                    className="w-full appearance-none border-none bg-transparent px-2 py-1 leading-tight focus:outline-none"
                    type="date"
                    aria-label="Set due date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              )}
            </div>
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
            <button
              className="flex-shrink-0 rounded border-4 border-red-500 bg-red-500 px-2 py-1 text-sm text-white transition-colors duration-200 hover:border-red-700 hover:bg-red-700"
              type="button"
              onClick={() => deleteTodo({ id: props.id })}
              hidden={!props.done}
            >
              <FaTrashAlt />
            </button>
          </div>
          {(tags || dueDate) && !props.done ? (
            <div className="mt-2 flex px-2 text-xs text-slate-400">
              {tags && (
                <div className="mr-2 inline-flex items-center">
                  <FaTag className="mr-0.5" />
                  {tags.split(",").map(
                    (tag, index) =>
                      tag.trim() !== "" && (
                        <span
                          key={index}
                          className="ml-0.5 rounded-md bg-slate-500 p-0.5 text-black"
                        >
                          {tag.trim()}
                        </span>
                      )
                  )}
                  {edit && (
                    <FaTimesCircle
                      className="ml-0.5"
                      onClick={() => setTags("")}
                    />
                  )}
                </div>
              )}
              {dueDate && (
                <div className="inline-flex items-center">
                  <FaCalendar className="mr-1" />
                  <span className="rounded-md bg-orange-500 p-0.5 text-black">
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
