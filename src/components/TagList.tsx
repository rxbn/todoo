import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FaTimesCircle } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { type RouterOutputs, api } from "~/utils/api";
import { LoadingSpinner } from "./Loading";

type Tag = RouterOutputs["tags"]["getByTodo"][number];
export const TagList = (props: {
  todoTags: Tag[];
  show: boolean;
  onShowChange: (show: boolean) => void;
  onTagChange: (newTags: Tag[]) => void;
}) => {
  const [input, setInput] = useState("");

  const filterTags = (tags: Tag[], search: string, existingTags: Tag[]) => {
    const existingTagNames = new Set(existingTags.map((tag) => tag.name));
    return tags.filter(
      (tag) =>
        tag.name.includes(search.trim()) && !existingTagNames.has(tag.name)
    );
  };

  const ctx = api.useContext();

  const { data: tags } = api.tags.getAll.useQuery();

  const { mutate: createTag, isLoading: isCreating } =
    api.tags.create.useMutation({
      onSuccess(data) {
        void ctx.tags.getAll.invalidate();
        props.onTagChange([...props.todoTags, data]);
        setInput("");
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        if (errorMessage && errorMessage[0]) {
          toast.error(errorMessage[0]);
        } else {
          toast.error("Failed to create tag");
        }
      },
    });

  const searchResult = tags && filterTags(tags, input, props.todoTags);

  const addTag = (tag: Tag) => {
    if (!props.todoTags.includes(tag)) {
      props.onTagChange([...props.todoTags, tag]);
      setInput("");
    }
  };
  return (
    <Transition appear show={props.show} as={Fragment}>
      <Dialog as="div" onClose={() => props.onShowChange(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white/60 p-6 text-left align-middle shadow-xl backdrop-blur-md transition-all dark:bg-white/10">
                <Dialog.Title as="h3" className="text-xl font-bold leading-6">
                  Set Tags
                </Dialog.Title>
                <div className="mt-2 flex items-center">
                  <input
                    className="h-8 w-full appearance-none rounded-lg border-none bg-black/20 px-2 leading-tight placeholder-black/50 focus:outline-none dark:bg-white/20 dark:placeholder-white/50"
                    type="text"
                    aria-label="Set tags"
                    placeholder="Press comma or enter to add tag"
                    autoFocus={true}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "," || e.key === "Enter") {
                        e.preventDefault();
                        if (input.trim() === "") {
                          toast.error("Tag can't be empty");
                          setInput("");
                          return;
                        }

                        if (
                          props.todoTags
                            .map((t) => t.name)
                            .includes(input.trim())
                        ) {
                          toast.error("Tag already set");
                          setInput("");
                          return;
                        }

                        const existingTag = tags?.find(
                          (t) => t.name === input.trim()
                        );
                        if (existingTag) {
                          addTag(existingTag);
                          setInput("");
                          return;
                        }

                        createTag({ name: input.trim() });
                      }
                    }}
                    disabled={isCreating}
                  />
                  {isCreating && (
                    <div className="absolute right-9">
                      <LoadingSpinner size={20} />
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center pt-2">
                  {props.todoTags.map((tag) => (
                    <span
                      key={tag.id}
                      className="mr-2 mt-2 flex cursor-default items-center rounded-md bg-slate-500 p-1 pl-2 text-white"
                    >
                      {tag.name}
                      <FaTimesCircle
                        className="ml-3 cursor-pointer rounded-full transition-colors duration-200 hover:border-red-500 hover:bg-red-500"
                        onClick={() => {
                          props.onTagChange(
                            props.todoTags.filter((t) => t !== tag)
                          );
                        }}
                      />
                    </span>
                  ))}
                </div>
                {searchResult && searchResult.length > 0 && (
                  <span className="inline-grid pt-2 font-semibold">
                    Available tags:
                  </span>
                )}
                <div className="flex w-full flex-wrap items-center">
                  {searchResult?.map((tag) => (
                    <span
                      key={tag.id}
                      className="mr-2 mt-2 flex cursor-pointer rounded-md bg-slate-500 p-1 text-white transition-colors duration-200 hover:bg-slate-700"
                      onClick={() => addTag(tag)}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
                <button
                  className="absolute right-2 top-2 rounded-full p-1 transition-colors duration-200 hover:bg-black/20 dark:hover:bg-white/20"
                  onClick={() => props.onShowChange(false)}
                >
                  <FaTimesCircle />
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
