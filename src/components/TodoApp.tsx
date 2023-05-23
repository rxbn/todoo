import { type SessionContextValue, signOut } from "next-auth/react";
import { api } from "~/utils/api";
import { NewTodo } from "./NewTodo";
import { TodoView } from "./TodoView";
import { FaSignOutAlt } from "react-icons/fa";

export const TodoApp = (props: { session: SessionContextValue }) => {
  if (!props.session.data) return null;

  const { data: incompleteTodos } = api.todos.get.useQuery({ done: false });
  const { data: completedTodos } = api.todos.get.useQuery({ done: true });

  return (
    <div>
      <div className="mb-8 text-center">
        Welcome, {props.session.data.user.name}!
      </div>
      <NewTodo />
      <TodoView title="Open" todos={incompleteTodos} />
      <TodoView title="Completed" todos={completedTodos} />
      <div className="fixed bottom-0 flex w-full justify-center pb-4">
        <button
          className="rounded border-4 border-red-500 bg-red-500 px-2 py-1 text-sm text-white transition-colors duration-200 hover:border-red-700 hover:bg-red-700"
          type="button"
          onClick={() => void signOut()}
        >
          <FaSignOutAlt className="inline-flex" />
          <span className="ml-2">Sign Out</span>
        </button>
      </div>
    </div>
  );
};
