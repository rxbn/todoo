import { Popover, Transition } from "@headlessui/react";
import { type Dispatch, Fragment, type SetStateAction } from "react";
import { FaCalendar } from "react-icons/fa";

export const DueDate = (props: {
  dueDate: string;
  hidden: boolean;
  setDueDate: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <div className="relative inline-flex">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              hidden={props.hidden}
              className={`${open ? "" : "text-opacity-90"}
              mr-2 flex-shrink-0 rounded border-4 border-orange-500 bg-orange-500 px-2 py-1 text-sm text-white outline-none transition-colors duration-200 hover:border-orange-700 hover:bg-orange-700`}
            >
              <FaCalendar />
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
              <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-[200px]">
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative bg-slate-400 p-7 text-black">
                    <span className="text-xl font-bold">Set due date:</span>
                    <input
                      className="w-full appearance-none border-none bg-transparent leading-tight focus:outline-none"
                      type="date"
                      aria-label="Set due date"
                      value={props.dueDate}
                      autoFocus={true}
                      onChange={(e) => props.setDueDate(e.target.value)}
                    />
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};
