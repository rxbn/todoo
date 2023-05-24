import { useState } from "react";
import { FaCalendar, FaPlus, FaTag } from "react-icons/fa";
import { api } from "~/utils/api";

export const NewTodo = () => {
  const [input, setInput] = useState("");
  const [tags, setTags] = useState("");
  const [dueDate, setDueDate] = useState("");

  const ctx = api.useContext();

  const { mutate, isLoading: isCreating } = api.todos.create.useMutation({
    onSuccess: () => {
      setInput("");
      setTags("");
      setDueDate("");
      void ctx.todos.get.invalidate();
    },
  });

  return (
    <div className="flex justify-center">
      <form className="w-full max-w-lg">
        <div className="border-b-2 border-blue-500 py-2">
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
            <button
              className="mr-2 flex-shrink-0 rounded border-4 border-slate-500 bg-slate-500 px-2 py-1 text-sm text-white transition-colors duration-200 hover:border-slate-700 hover:bg-slate-700"
              type="button"
              onClick={() => setTags("Work")}
            >
              <FaTag />
            </button>
            <button
              className="mr-2 flex-shrink-0 rounded border-4 border-orange-500 bg-orange-500 px-2 py-1 text-sm text-white transition-colors duration-200 hover:border-orange-700 hover:bg-orange-700"
              type="button"
              onClick={() => setDueDate("2023-05-24")}
            >
              <FaCalendar />
            </button>
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
          <div className="mt-2 flex px-2 text-xs text-slate-400">
            {tags.length > 0 && (
              <div className="mr-2 inline-flex items-center">
                <FaTag className="mr-1" />
                <span className="rounded-md bg-slate-500 p-0.5 text-black">
                  {tags}
                </span>
              </div>
            )}
            {dueDate && (
              <div className="inline-flex items-center">
                <FaCalendar className="mr-1" />
                <span className="rounded-md bg-orange-500 p-0.5 text-black">
                  {dueDate}
                </span>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
