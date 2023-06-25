import { signOut } from "next-auth/react";
import { api } from "~/utils/api";
import { NewTodo } from "./NewTodo";
import { TodoView } from "./TodoView";
import { FaSignOutAlt, FaTag } from "react-icons/fa";
import { useState } from "react";
import { EditTags } from "./EditTags";
import { LoadingPage } from "./Loading";

export const TodoApp = () => {
  const { data: incompleteTodos, isLoading: incompleteTodosLoading } =
    api.todos.get.useQuery({ done: false });
  const { data: completedTodos, isLoading: completedTodosLoading } =
    api.todos.get.useQuery({ done: true });

  const [showEditTags, setShowEditTags] = useState(false);

  const handleShowEditTagsChange = (newShow: boolean) => {
    setShowEditTags(newShow);
  };

  if (incompleteTodosLoading || completedTodosLoading) return <LoadingPage />;

  return (
    <div className="mx-2 mb-8 mt-3 flex flex-col items-center">
      <div className="w-full max-w-xl self-center">
        <div className="mb-12 flex items-center justify-between">
          <h1 className="text-4xl font-bold">ToDoo</h1>
          <div>
            <button
              className="mr-2 rounded border-4 border-slate-500 bg-slate-500 px-2 py-1 text-sm text-white outline-none transition-colors duration-200 hover:border-slate-700 hover:bg-slate-700"
              type="button"
              onClick={() => setShowEditTags(true)}
            >
              <FaTag className="inline-flex" />
            </button>
            <button
              className="rounded border-4 border-red-500 bg-red-500 px-2 py-1 text-sm text-white outline-none transition-colors duration-200 hover:border-red-700 hover:bg-red-700"
              type="button"
              onClick={() => void signOut()}
            >
              <FaSignOutAlt className="inline-flex" />
            </button>
          </div>
        </div>
        <NewTodo />
        <TodoView title="Open" todos={incompleteTodos} />
        <TodoView title="Completed" todos={completedTodos} />
        <EditTags show={showEditTags} onShowChange={handleShowEditTagsChange} />
      </div>
    </div>
  );
};
