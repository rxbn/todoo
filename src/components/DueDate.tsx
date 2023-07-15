import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FaTimesCircle } from "react-icons/fa";
import Calendar from "react-calendar";
import dayjs from "dayjs";

export const DueDate = (props: {
  dueDate: string;
  show: boolean;
  onShowChange: (show: boolean) => void;
  onDateChange: (newDate: string) => void;
}) => {
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
                  Set Due Date
                </Dialog.Title>
                <Calendar
                  className="mt-2"
                  value={props.dueDate}
                  minDate={new Date()}
                  onChange={(e) => {
                    if (!e) return;
                    const newDate = dayjs(e.toString()).format("YYYY-MM-DD");
                    props.onDateChange(newDate);
                    props.onShowChange(false);
                  }}
                  minDetail="year"
                />
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
