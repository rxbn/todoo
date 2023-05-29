import { Popover, Transition } from "@headlessui/react";
import { type Dispatch, Fragment, type SetStateAction } from "react";
import { FaTag } from "react-icons/fa";

export const TagList = (props: {
  tags: string;
  hidden: boolean;
  setTags: Dispatch<SetStateAction<string>>;
}) => {
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
                        value={props.tags}
                        autoFocus={true}
                        onChange={(e) => props.setTags(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            close();
                          }
                        }}
                      />
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
