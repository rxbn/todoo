import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { api } from "~/utils/api";

export const NewTodo = () => {
  const [input, setInput] = useState("");

  const ctx = api.useContext();

  const { mutate, isLoading: isCreating } = api.todos.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.todos.get.invalidate();
    },
  });

  return (
    <div className="flex justify-center">
      <form className="w-full max-w-lg">
        <div className="flex items-center border-b-2 border-blue-500 py-2">
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
                  mutate({ content: input });
                }
              }
            }}
            disabled={isCreating}
          />
          <button
            className="flex-shrink-0 rounded border-4 border-blue-500 bg-blue-500 px-2 py-1 text-sm text-white transition-colors duration-200 hover:border-blue-700 hover:bg-blue-700"
            type="button"
            onClick={() => {
              if (input !== "") {
                mutate({ content: input });
              }
            }}
          >
            <FaPlus />
          </button>
        </div>
      </form>
    </div>
  );
};
