import { FaCheck, FaTrashAlt } from "react-icons/fa";
import { api } from "~/utils/api";

export const TodoItem = (props: {
  id: string;
  content: string;
  done: boolean;
}) => {
  const ctx = api.useContext();

  const { mutate: markComplete } = api.todos.markComplete.useMutation({
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
            value={props.content}
            aria-label={props.content}
          />
          <button
            className="flex-shrink-0 rounded border-4 border-green-500 bg-green-500 px-2 py-1 text-sm text-white transition-colors duration-200 hover:border-green-700 hover:bg-green-700"
            type="button"
            onClick={() => markComplete({ id: props.id })}
            hidden={props.done}
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
