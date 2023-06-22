import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { FaPencilAlt, FaSave, FaTimesCircle, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { type RouterOutputs, api } from "~/utils/api";

type Tag = RouterOutputs["tags"]["getAll"][number];
const EditTagItem = (tag: Tag) => {
  const [edit, setEdit] = useState(false);
  const [input, setInput] = useState(tag.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const ctx = api.useContext();

  const { mutate: deleteTag } = api.tags.delete.useMutation({
    onSuccess: () => {
      void ctx.tags.getAll.invalidate();
      void ctx.tags.search.invalidate();
      void ctx.tags.getByTodo.invalidate();
    },
  });

  const { mutate: editTag } = api.tags.edit.useMutation({
    onSuccess: () => {
      void ctx.tags.getAll.invalidate();
      void ctx.tags.search.invalidate();
      void ctx.tags.getByTodo.invalidate();
    },
    onError: () => {
      toast.error("Tag name must be unique");
      setInput(tag.name);
    },
  });

  useEffect(() => {
    if (edit && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [edit]);

  return (
    <div key={tag.id} className="mb-2 flex">
      <input
        className="mr-2 w-full rounded-md bg-slate-500 px-2 py-1"
        type="text"
        value={input}
        spellCheck={false}
        aria-label={tag.name}
        ref={inputRef}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") {
              editTag({
                id: tag.id,
                name: input,
              });
              if (inputRef.current) {
                inputRef.current.setSelectionRange(
                  inputRef.current.value.length,
                  inputRef.current.value.length
                );
              }
              setEdit(false);
            }
          }
        }}
        readOnly={!edit}
      />
      <button
        onClick={() => setEdit(true)}
        className="mr-2 flex-shrink-0 rounded border-4 border-gray-500 bg-gray-500 px-2 py-1 text-sm text-white outline-none transition-colors duration-200 hover:border-gray-700 hover:bg-gray-700"
        hidden={edit}
      >
        <FaPencilAlt />
      </button>
      <button
        className="mr-2 flex-shrink-0 rounded border-4 border-green-500 bg-green-500 px-2 py-1 text-sm text-white transition-colors duration-200 hover:border-green-700 hover:bg-green-700"
        type="button"
        onClick={() => {
          if (input !== "") {
            editTag({
              id: tag.id,
              name: input,
            });
            setEdit(false);
          }
        }}
        hidden={!edit}
      >
        <FaSave />
      </button>
      <button
        onClick={() => deleteTag({ id: tag.id })}
        className="flex-shrink-0 rounded border-4 border-red-500 bg-red-500 px-2 py-1 text-sm text-white outline-none transition-colors duration-200 hover:border-red-700 hover:bg-red-700"
      >
        <FaTrashAlt />
      </button>
    </div>
  );
};

export const EditTags = (props: {
  show: boolean;
  onShowChange: (show: boolean) => void;
}) => {
  const { data: tags } = api.tags.getAll.useQuery();

  return (
    <Transition appear show={props.show} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => props.onShowChange(false)}
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
                    tags.map((tag) => <EditTagItem key={tag.id} {...tag} />)
                  ) : (
                    <div className="text-sm">No tags</div>
                  )}
                </div>
                <button
                  className="absolute right-2 top-2 rounded-full p-1 transition-colors duration-200 hover:bg-white/20"
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
