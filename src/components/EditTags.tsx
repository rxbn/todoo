import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction } from "react";
import { FaPencilAlt, FaTimesCircle, FaTrashAlt } from "react-icons/fa";
import { api } from "~/utils/api";

export const EditTags = (props: {
  show: boolean;
  setShowEditTags: Dispatch<SetStateAction<boolean>>;
}) => {
  const { data: tags } = api.tags.getAll.useQuery();

  const ctx = api.useContext();

  const { mutate: deleteTag } = api.tags.delete.useMutation({
    onSuccess: () => {
      void ctx.tags.getAll.invalidate();
      void ctx.tags.search.invalidate();
    },
  });

  return (
    <Transition appear show={props.show} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => props.setShowEditTags(false)}
      >
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white/10 p-6 text-left align-middle shadow-xl backdrop-blur-md transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-bold leading-6 text-white"
                >
                  Edit Tags
                </Dialog.Title>
                <div className="mt-2">
                  {tags && tags.length > 0 ? (
                    tags.map((tag) => (
                      <div className="mb-2 flex">
                        <input
                          className="mr-2 w-full rounded-md bg-slate-500 px-2 py-1"
                          type="text"
                          value={tag.name}
                          spellCheck={false}
                          aria-label={tag.name}
                          readOnly={true}
                        />
                        <button className="mr-2 flex-shrink-0 rounded border-4 border-gray-500 bg-gray-500 px-2 py-1 text-sm text-white outline-none transition-colors duration-200 hover:border-gray-700 hover:bg-gray-700">
                          <FaPencilAlt />
                        </button>
                        <button
                          onClick={() => deleteTag({ id: tag.id })}
                          className="flex-shrink-0 rounded border-4 border-red-500 bg-red-500 px-2 py-1 text-sm text-white outline-none transition-colors duration-200 hover:border-red-700 hover:bg-red-700"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm">No tags</div>
                  )}
                </div>
                <button
                  className="absolute right-2 top-2 rounded-full p-1 transition-colors duration-200 hover:bg-white/20"
                  onClick={() => props.setShowEditTags(false)}
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
