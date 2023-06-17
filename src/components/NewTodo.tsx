import { useState } from "react";
import { FaCalendar, FaPlus, FaTag, FaTimesCircle } from "react-icons/fa";
import { api } from "~/utils/api";
import { TagList } from "./TagList";
import { DueDate } from "./DueDate";

export const NewTodo = () => {
  const [input, setInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState("");

  const ctx = api.useContext();

  const { mutate, isLoading: isCreating } = api.todos.create.useMutation({
    onSuccess: () => {
      setInput("");
      setTags([]);
      setDueDate("");
      void ctx.todos.get.invalidate();
    },
  });

  return (
    <div className="flex justify-center">
      <form className="w-full max-w-lg">
        <div className="relative border-b-2 border-blue-500 py-2">
          <div className="flex items-center">
            <input
              className="mr-3 w-full appearance-none border-none bg-transparent px-2 py-1 leading-tight text-white focus:outline-none"
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
                    mutate({ content: input, dueDate, tags });
                  }
                }
              }}
              disabled={isCreating}
            />
            <TagList hidden={false} tags={tags} setTags={setTags} />
            <DueDate hidden={false} dueDate={dueDate} setDueDate={setDueDate} />
            <button
              className="flex-shrink-0 rounded border-4 border-blue-500 bg-blue-500 px-2 py-1 text-sm text-white transition-colors duration-200 hover:border-blue-700 hover:bg-blue-700"
              type="button"
              onClick={() => {
                if (input !== "") {
                  mutate({ content: input, dueDate, tags });
                }
              }}
            >
              <FaPlus />
            </button>
          </div>
          {tags.length > 0 || dueDate ? (
            <div className="mt-2 flex flex-wrap px-2 text-sm text-slate-400">
              {tags.length > 0 && (
                <div className="mb-0.5 mr-2 flex flex-wrap items-center">
                  <FaTag className="mr-0.5" />
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="m-0.5 ml-0.5 rounded-md bg-slate-500 p-0.5 text-white"
                    >
                      {tag}
                    </span>
                  ))}
                  <FaTimesCircle
                    className="ml-0.5"
                    onClick={() => setTags([])}
                  />
                </div>
              )}
              {dueDate && (
                <div className="mb-0.5 flex items-center">
                  <FaCalendar className="mr-0.5" />
                  <span className="rounded-md bg-orange-500 p-0.5 text-white">
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
