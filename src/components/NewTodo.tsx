import { useEffect, useRef, useState } from "react";
import { FaCalendar, FaPlus, FaTag, FaTimesCircle } from "react-icons/fa";
import { api } from "~/utils/api";

export const NewTodo = () => {
  const [input, setInput] = useState("");
  const [tags, setTags] = useState("");
  const [tagList, showTagList] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [calendar, showCalendar] = useState(false);

  const ctx = api.useContext();

  const { mutate, isLoading: isCreating } = api.todos.create.useMutation({
    onSuccess: () => {
      setInput("");
      setTags("");
      setDueDate("");
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

  return (
    <div className="flex justify-center">
      <form className="w-full max-w-lg">
        <div className="relative border-b-2 border-blue-500 py-2">
          <div className="flex items-center">
            <input
              className="mr-3 w-full appearance-none border-none bg-transparent px-2 py-1 leading-tight text-gray-400 focus:outline-none"
              type="text"
              placeholder="New Todo"
              spellCheck={false}
              aria-label="New Todo"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (input !== "") {
                    mutate({ content: input, tags, dueDate });
                  }
                }
              }}
              disabled={isCreating}
            />
            <div className="relative inline-flex">
              <button
                className="mr-2 flex-shrink-0 rounded border-4 border-slate-500 bg-slate-500 px-2 py-1 text-sm text-white transition-colors duration-200 hover:border-slate-700 hover:bg-slate-700"
                type="button"
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
              className="flex-shrink-0 rounded border-4 border-blue-500 bg-blue-500 px-2 py-1 text-sm text-white transition-colors duration-200 hover:border-blue-700 hover:bg-blue-700"
              type="button"
              onClick={() => {
                if (input !== "") {
                  mutate({ content: input, tags, dueDate });
                }
              }}
            >
              <FaPlus />
            </button>
          </div>
          {tags || dueDate ? (
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
                  <FaTimesCircle
                    className="ml-0.5"
                    onClick={() => setTags("")}
                  />
                </div>
              )}
              {dueDate && (
                <div className="inline-flex items-center">
                  <FaCalendar className="mr-1" />
                  <span className="rounded-md bg-orange-500 p-0.5 text-black">
                    {dueDate}
                  </span>
                  <FaTimesCircle
                    className="ml-0.5"
                    onClick={() => setDueDate("")}
                  />
                </div>
              )}
            </div>
          ) : null}
        </div>
      </form>
    </div>
  );
};
