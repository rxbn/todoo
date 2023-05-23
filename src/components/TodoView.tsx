import type { Todo } from "@prisma/client";
import { TodoItem } from "./TodoItem";

export const TodoView = (props: {
  title: string;
  todos: Array<Todo> | undefined;
}) => {
  if (!props.todos) return null;
  if (props.todos.length === 0) return null;

  return (
    <div>
      <div className="h-8" />
      <h2 className="pb-3 text-center text-2xl font-bold">{props.title}</h2>
      {props.todos.map((todo) => (
        <TodoItem id={todo.id} content={todo.content} done={todo.done} />
      ))}
    </div>
  );
};
