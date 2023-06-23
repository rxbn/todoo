import { signOut } from "next-auth/react";
import { api } from "~/utils/api";
import { NewTodo } from "./NewTodo";
import { TodoView } from "./TodoView";
import { FaSignOutAlt, FaTag } from "react-icons/fa";
import { useState } from "react";
import { EditTags } from "./EditTags";
import { LoadingPage } from "./Loading";

export const TodoApp = (props: { userName: string | null | undefined }) => {
  const { data: incompleteTodos, isLoading: incompleteTodosLoading } =
    api.todos.get.useQuery({ done: false });
  const { data: completedTodos, isLoading: completedTodosLoading } =
    api.todos.get.useQuery({ done: true });

  const [showEditTags, setShowEditTags] = useState(false);

  const handleShowChange = (newShow: boolean) => {
    setShowEditTags(newShow);
  };

  if (incompleteTodosLoading || completedTodosLoading) return <LoadingPage />;

  return (
    <div>
      <div className="mb-4 text-center">Welcome, {props.userName}!</div>
      <div className="mb-8 inline-flex w-full justify-center">
        <button
          className="mr-2 rounded border-4 border-slate-500 bg-slate-500 px-2 py-1 text-sm text-white transition-colors duration-200 hover:border-slate-700 hover:bg-slate-700"
          type="button"
          onClick={() => setShowEditTags(true)}
        >
          <FaTag className="inline-flex" />
          <span className="ml-2">Edit Tags</span>
        </button>
        <button
          className="rounded border-4 border-red-500 bg-red-500 px-2 py-1 text-sm text-white transition-colors duration-200 hover:border-red-700 hover:bg-red-700"
          type="button"
          onClick={() => void signOut()}
        >
          <FaSignOutAlt className="inline-flex" />
          <span className="ml-2">Sign Out</span>
        </button>
        <EditTags show={showEditTags} onShowChange={handleShowChange} />
      </div>
      <NewTodo />
      <TodoView title="Open" todos={incompleteTodos} />
      <TodoView title="Completed" todos={completedTodos} />
    </div>
  );
};
