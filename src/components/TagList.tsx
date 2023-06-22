import { Popover, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FaTag, FaTimesCircle } from "react-icons/fa";
import { type RouterOutputs, api } from "~/utils/api";

type Tag = RouterOutputs["tags"]["getByTodo"][number];
export const TagList = (props: {
  todoTags: Tag[];
  hidden: boolean;
  onTagChange: (newTags: Tag[]) => void;
}) => {
  const [input, setInput] = useState("");

  const filterTags = (tags: Tag[], search: string, existingTags: Tag[]) => {
    const existingTagNames = new Set(existingTags.map((tag) => tag.name));
    return tags.filter(
      (tag) => tag.name.includes(search) && !existingTagNames.has(tag.name)
    );
  };

  const ctx = api.useContext();

  const { data: tags, isLoading } = api.tags.getAll.useQuery();

  const { mutate: createTag, isLoading: isCreating } =
    api.tags.create.useMutation({
      onSuccess(data) {
        void ctx.tags.getAll.invalidate();
        props.onTagChange([...props.todoTags, data]);
        setInput("");
      },
    });

  const searchResult = tags && filterTags(tags, input, props.todoTags);

  const addTag = (tag: Tag) => {
    if (!props.todoTags.includes(tag)) {
      props.onTagChange([...props.todoTags, tag]);
      setInput("");
    }
  };

  if (isLoading) return null;

  return (
    <div className="relative inline-flex">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              hidden={props.hidden}
              className={`${open ? "" : "text-opacity-90"}
            mr-2 flex-shrink-0 rounded border-4 border-slate-500 bg-slate-500 px-2 py-1 text-sm text-white outline-none transition-colors duration-200 hover:border-slate-700 hover:bg-slate-700`}
            >
              <FaTag />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-sm">
                {({ close }) => (
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="relative bg-white/10 p-7 text-white backdrop-blur-md">
                      <span className="text-xl font-bold">Set tags:</span>
                      <input
                        className="mt-2 h-8 w-full appearance-none rounded-lg border-none bg-white/20 px-2 leading-tight focus:outline-none"
                        type="text"
                        aria-label="Set tags"
                        autoFocus={true}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "," || e.key === "Enter") {
                            e.preventDefault();
                            if (input === "") return;

                            if (
                              props.todoTags.map((t) => t.name).includes(input)
                            ) {
                              addTag(
                                props.todoTags.find((t) => t.name === input)!
                              );
                              setInput("");
                              return;
                            }

                            if (
                              tags &&
                              tags.map((t) => t.name).includes(input)
                            ) {
                              addTag(tags.find((t) => t.name === input)!);
                              setInput("");
                              return;
                            }

                            createTag({ name: input });
                          }
                        }}
                        disabled={isCreating}
                      />
                      <div className="flex flex-wrap items-center pt-2">
                        {props.todoTags.map((tag) => (
                          <span
                            key={tag.id}
                            className="mr-2 mt-2 flex cursor-default items-center rounded-md bg-slate-500 p-1 pl-2"
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
                      <span className="inline-grid pt-2 text-lg font-bold">
                        Available tags:
                      </span>
                      <div className="flex w-full flex-wrap items-center">
                        {searchResult?.map((tag) => (
                          <span
                            key={tag.id}
                            className="mr-2 mt-2 flex cursor-pointer rounded-md bg-slate-500 p-1 transition-colors duration-200 hover:bg-slate-700"
                            onClick={() => addTag(tag)}
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                      <Popover.Button
                        className="absolute right-2 top-2 rounded-full p-1 transition-colors duration-200 hover:bg-white/20"
                        onClick={() => close()}
                      >
                        <FaTimesCircle />
                      </Popover.Button>
                    </div>
                  </div>
                )}
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};
