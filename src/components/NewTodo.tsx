import { useState } from "react";
import { FaCalendar, FaPlus, FaTag, FaTimesCircle } from "react-icons/fa";
import { type RouterOutputs, api } from "~/utils/api";
import { TagList } from "./TagList";
import { DueDate } from "./DueDate";
import toast from "react-hot-toast";
import { LoadingSpinner } from "./Loading";

type Tag = RouterOutputs["tags"]["getAll"][number];
export const NewTodo = () => {
  const [input, setInput] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [dueDate, setDueDate] = useState("");
  const [showTagList, setShowTagList] = useState(false);
  const [showDueDate, setShowDueDate] = useState(false);

  const handleShowTagListChange = (newShow: boolean) => {
    setShowTagList(newShow);
  };
  const handleShowDueDateChange = (newShow: boolean) => {
    setShowDueDate(newShow);
  };
  const handleDateChange = (newDate: string) => {
    setDueDate(newDate);
  };
  const handleTagChange = (newTags: Tag[]) => {
    setTags(newTags);
  };

  const ctx = api.useContext();

  const { mutate, isLoading: isCreating } = api.todos.create.useMutation({
    onSuccess: () => {
      setInput("");
      setTags([]);
      setDueDate("");
      void ctx.todos.get.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to create todo");
      }
    },
  });

  return (
    <div className="flex justify-center">
      <form className="w-full max-w-lg">
        <div className="relative border-b-2 border-blue-500 py-2">
          <div className="flex items-center">
            <input
              className="mr-3 w-full appearance-none border-none bg-transparent px-2 py-1 leading-tight text-white focus:outline-none"
              type="text"
              placeholder="New Todo"
              spellCheck={false}
              aria-label="New Todo"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (input.trim() === "") {
                    toast.error("Todo can't be empty");
                    setInput("");
                    return;
                  }

                  mutate({
                    content: input.trim(),
                    dueDate,
                    tags: tags.map((tag) => tag.id),
                  });
                }
              }}
              disabled={isCreating}
            />
            {isCreating && (
              <div className="mr-2 flex items-center justify-center">
                <LoadingSpinner size={20} />
              </div>
            )}
            <button
              className=" mr-2 flex-shrink-0 rounded border-4 border-slate-500 bg-slate-500 px-2 py-1 text-sm text-white outline-none transition-colors duration-200 hover:border-slate-700 hover:bg-slate-700"
              type="button"
              onClick={() => setShowTagList(true)}
            >
              <FaTag />
            </button>
            <TagList
              show={showTagList}
              todoTags={tags}
              onTagChange={handleTagChange}
              onShowChange={handleShowTagListChange}
            />
            <button
              className="mr-2 flex-shrink-0 rounded border-4 border-orange-500 bg-orange-500 px-2 py-1 text-sm text-white outline-none transition-colors duration-200 hover:border-orange-700 hover:bg-orange-700"
              type="button"
              onClick={() => setShowDueDate(true)}
            >
              <FaCalendar />
            </button>
            <DueDate
              show={showDueDate}
              dueDate={dueDate}
              onDateChange={handleDateChange}
              onShowChange={handleShowDueDateChange}
            />
            <button
              className="flex-shrink-0 rounded border-4 border-blue-500 bg-blue-500 px-2 py-1 text-sm text-white transition-colors duration-200 hover:border-blue-700 hover:bg-blue-700"
              type="button"
              disabled={isCreating}
              onClick={() => {
                if (input.trim() === "") {
                  toast.error("Todo can't be empty");
                  setInput("");
                  return;
                }

                mutate({
                  content: input.trim(),
                  dueDate,
                  tags: tags.map((tag) => tag.id),
                });
              }}
            >
              <FaPlus />
            </button>
          </div>
          {tags.length > 0 || dueDate ? (
            <div className="mt-2 flex flex-wrap px-2 text-sm text-slate-400">
              {tags.length > 0 && (
                <div className="mb-0.5 mr-2 flex flex-wrap items-center">
                  <FaTag className="mr-0.5" />
                  {tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="m-0.5 ml-0.5 rounded-md bg-slate-500 p-0.5 text-white"
                    >
                      {tag.name}
                    </span>
                  ))}
                  <FaTimesCircle
                    className="ml-0.5"
                    onClick={() => setTags([])}
                  />
                </div>
              )}
              {dueDate && (
                <div className="mb-0.5 flex items-center">
                  <FaCalendar className="mr-0.5" />
                  <span className="rounded-md bg-orange-500 p-0.5 text-white">
                    {dueDate}
                  </span>
                  <FaTimesCircle
                    className="ml-0.5"
                    onClick={() => setDueDate("")}
                  />
                </div>
              )}
            </div>
          ) : null}
        </div>
      </form>
    </div>
  );
};
