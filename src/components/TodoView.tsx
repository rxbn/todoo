import { FaFilter } from "react-icons/fa";
import { TodoItem } from "./TodoItem";
import type { RouterOutputs } from "~/utils/api";
import { useState } from "react";
import { FilterView } from "./FilterView";

type Todo = RouterOutputs["todos"]["get"][number];
export const TodoView = (props: {
  title: "Open" | "Completed";
  todos: Todo[] | undefined;
}) => {
  const [showFilterView, setShowFilterView] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  if (!props.todos) return null;
  if (props.todos.length === 0) return null;

  const filterTodos = (todos: Todo[]) => {
    return todos.filter((todo) => {
      const matchesSearch =
        !search || todo.content.toLowerCase().includes(search.toLowerCase());
      const matchesTags =
        selectedTags.length === 0 ||
        todo.tags.some((tag) => selectedTags.includes(tag.id));
      return matchesSearch && matchesTags;
    });
  };

  const handleShowFilterViewChange = (newShow: boolean) => {
    setShowFilterView(newShow);
  };
  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
  };
  const handleSelectedTagsChange = (newSelectedTags: string[]) => {
    setSelectedTags(newSelectedTags);
  };

  return (
    <div>
      <div className="h-8" />
      <h2 className="mb-3 text-center text-2xl font-bold">{props.title}</h2>
      {props.title === "Open" && (
        <div className="mb-3 flex justify-center">
          <button
            className="inline-flex items-center rounded border-4 border-slate-500 bg-slate-500 px-2 py-1 text-sm text-white outline-none transition-colors duration-200 hover:border-slate-700 hover:bg-slate-700"
            type="button"
            onClick={() => setShowFilterView(true)}
          >
            <FaFilter />
            <span className="ml-2">
              {search ? `"${search}"` : "Filter Todos"}
              {selectedTags.length > 0 && `, ${selectedTags.length} Tag(s)`}
            </span>
          </button>
          <FilterView
            show={showFilterView}
            onShowChange={handleShowFilterViewChange}
            search={search}
            onSearchChange={handleSearchChange}
            selectedTags={selectedTags}
            onSelectedTagsChange={handleSelectedTagsChange}
          />
        </div>
      )}
      {filterTodos(props.todos)?.map((todo) => (
        <TodoItem {...todo} key={todo.id} />
      ))}
      {filterTodos(props.todos)?.length === 0 && (
        <div className="mt-3 text-center text-lg font-semibold">
          No todos match your search.
        </div>
      )}
    </div>
  );
};
