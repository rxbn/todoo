import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FaTimesCircle } from "react-icons/fa";
import { api } from "~/utils/api";

export const FilterView = (props: {
  show: boolean;
  onShowChange: (show: boolean) => void;
  search: string;
  onSearchChange: (search: string) => void;
  selectedTags: string[];
  onSelectedTagsChange: (selectedTags: string[]) => void;
}) => {
  const { data: tags } = api.tags.getAll.useQuery();

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
                  Filter Todos
                </Dialog.Title>
                <div className="mt-2">
                  <input
                    className="mb-2 w-full appearance-none rounded-lg border-none bg-black/20 p-2 placeholder-black/50 focus:outline-none dark:bg-white/20 dark:placeholder-white/50"
                    type="text"
                    placeholder="Search Todos..."
                    value={props.search}
                    spellCheck={false}
                    aria-label={props.search}
                    onChange={(e) => props.onSearchChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        props.onShowChange(false);
                      }
                    }}
                  />
                  {tags && tags.length > 0 && (
                    <span className="text-lg font-semibold">
                      Filter by tags:
                    </span>
                  )}
                  {tags?.map((tag) => (
                    <div key={tag.id}>
                      <input
                        type="checkbox"
                        className="mr-2 outline-none"
                        id={tag.id}
                        name={tag.id}
                        value={tag.id}
                        checked={props.selectedTags.includes(tag.id)}
                        onChange={() => {
                          props.selectedTags.includes(tag.id)
                            ? props.onSelectedTagsChange(
                                props.selectedTags.filter((c) => c !== tag.id),
                              )
                            : props.onSelectedTagsChange([
                                ...props.selectedTags,
                                tag.id,
                              ]);
                        }}
                      />
                      <label htmlFor={tag.id}>{tag.name}</label>
                    </div>
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
