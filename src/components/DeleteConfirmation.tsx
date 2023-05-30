import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { api } from "~/utils/api";

export const DeleteConfirmation = (props: { hidden: boolean; id: string }) => {
  const ctx = api.useContext();

  const { mutate: deleteTodo } = api.todos.delete.useMutation({
    onSuccess: () => {
      void ctx.todos.get.invalidate();
    },
  });

  return (
    <div className="relative inline-flex">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              hidden={props.hidden}
              className={`${open ? "" : "text-opacity-90"}
              flex-shrink-0 rounded border-4 border-red-500 bg-red-500 px-2 py-1 text-sm text-white transition-colors duration-200 hover:border-red-700 hover:bg-red-700`}
            >
              <FaTrashAlt />
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
              <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-xs">
                {({ close }) => (
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="relative bg-white/10 p-7 text-white backdrop-blur-md">
                      <span className="text-xl font-bold">Are you sure?</span>
                      <div className="flex justify-center">
                        <button
                          className="mr-2 mt-2 h-8 w-full appearance-none rounded-lg border-none bg-gray-500 px-2 leading-tight transition-colors duration-200 hover:bg-gray-700 focus:outline-none"
                          onClick={() => close()}
                        >
                          No
                        </button>
                        <button
                          className="mt-2 h-8 w-full appearance-none  rounded-lg border-none bg-red-500 px-2 leading-tight transition-colors duration-200 hover:bg-red-700 focus:outline-none"
                          onClick={() => deleteTodo({ id: props.id })}
                        >
                          Yes
                        </button>
                      </div>
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
