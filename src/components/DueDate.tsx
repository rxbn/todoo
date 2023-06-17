import { Popover, Transition } from "@headlessui/react";
import { type Dispatch, Fragment, type SetStateAction } from "react";
import {
  FaCalendar,
  FaCaretLeft,
  FaCaretRight,
  FaTimesCircle,
} from "react-icons/fa";
import Calendar from "react-calendar";
import dayjs from "dayjs";

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
              <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-sm">
                {({ close }) => (
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="relative bg-white/10 p-7 text-white backdrop-blur-md">
                      <span className="text-xl font-bold">Set due date:</span>
                      <Calendar
                        className="mt-2 rounded bg-white/20 p-2"
                        tileClassName="hover:bg-white/20 rounded transition-colors duration-200 py-2 px-2"
                        value={props.dueDate}
                        nextLabel={
                          <div className="rounded bg-white/20 p-0.5">
                            <FaCaretRight />
                          </div>
                        }
                        prevLabel={
                          <div className="rounded bg-white/20 p-0.5">
                            <FaCaretLeft />
                          </div>
                        }
                        next2Label={null}
                        prev2Label={null}
                        onChange={(e) => {
                          if (!e) return;
                          props.setDueDate(
                            dayjs(e.toString()).format("YYYY-MM-DD")
                          );
                          close();
                        }}
                      />
                      <Popover.Button
                        className="absolute right-2 top-2 rounded-full p-1 transition-colors duration-200 hover:bg-white/20"
                        onClick={() => {
                          close();
                        }}
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
