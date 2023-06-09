import { TodoItem } from "./TodoItem";
import type { RouterOutputs } from "~/utils/api";

type Todo = RouterOutputs["todos"]["get"][number];
export const TodoView = (props: {
  title: string;
  todos: Todo[] | undefined;
}) => {
  if (!props.todos) return null;
  if (props.todos.length === 0) return null;

  return (
    <div>
      <div className="h-8" />
      <h2 className="pb-3 text-center text-2xl font-bold">{props.title}</h2>
      {props.todos.map((todo) => (
        <TodoItem {...todo} key={todo.id} />
      ))}
    </div>
  );
};
