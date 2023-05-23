import { useState } from "react";
import { FaCheck, FaPencilAlt, FaSave, FaTrashAlt } from "react-icons/fa";
import { RouterOutputs, api } from "~/utils/api";

type Todo = RouterOutputs["todos"]["get"][number];
export const TodoItem = (props: Todo) => {
  const [edit, setEdit] = useState(false);
  const [input, setInput] = useState(props.content);

  const ctx = api.useContext();

  const { mutate: markComplete } = api.todos.markComplete.useMutation({
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

  return (
    <div className="flex justify-center">
      <ul className="w-full max-w-lg">
        <li className="flex items-center border-b-2 border-blue-500 py-2">
          <input
            className={`mr-3 w-full appearance-none border-none bg-transparent px-2 py-1 leading-tight text-gray-400 focus:outline-none ${
              props.done ? "line-through" : ""
            }`}
            type="text"
            value={input}
            spellCheck={false}
            aria-label={props.content}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (input !== "") {
                  editTodo({ id: props.id, content: input });
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
          <button
            className="flex-shrink-0 rounded border-4 border-gray-500 bg-gray-500 px-2 py-1 text-sm text-white transition-colors duration-200 hover:border-gray-700 hover:bg-gray-700"
            type="button"
            onClick={() => {
              if (input !== "") {
                editTodo({ id: props.id, content: input });
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
            onClick={() => markComplete({ id: props.id })}
            hidden={props.done || edit}
          >
            <FaCheck />
          </button>
          <button
            className="flex-shrink-0 rounded border-4 border-red-500 bg-red-500 px-2 py-1 text-sm text-white transition-colors duration-200 hover:border-red-700 hover:bg-red-700"
            type="button"
            onClick={() => deleteTodo({ id: props.id })}
            hidden={!props.done}
          >
            <FaTrashAlt />
          </button>
        </li>
      </ul>
    </div>
  );
};
