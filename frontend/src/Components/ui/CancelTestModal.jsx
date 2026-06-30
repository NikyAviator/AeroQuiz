import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

// CancelTestModal — confirmation gate before abandoning an in-progress test.
// Clearing sessionStorage happens in the parent's onConfirm handler,
// this component only handles the visual confirmation step.
//
// Props:
//   open      → boolean — whether the modal is visible
//   onClose   → called when user backs out (keeps the test running)
//   onConfirm → called when user confirms cancellation

export default function CancelTestModal({ open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-20">
      <DialogBackdrop
        transition
        className="data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in fixed inset-0 bg-gray-900/75 transition-opacity"
      />

      <div className="fixed inset-0 z-20 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <DialogPanel
            transition
            className="data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in data-closed:sm:translate-y-0 data-closed:sm:scale-95 relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all dark:bg-gray-900 sm:my-8 sm:w-full sm:max-w-md sm:p-6"
          >
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <ExclamationTriangleIcon className="size-6 text-red-600 dark:text-red-400" />
            </div>

            <div className="mt-4 text-center">
              <DialogTitle
                as="h3"
                className="text-lg font-semibold text-gray-900 dark:text-white"
              >
                Cancel this test?
              </DialogTitle>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Your progress will not be saved. You will need to start a new
                test from the beginning with a fresh set of questions.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-600 dark:hover:bg-gray-700"
              >
                Keep Going
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500"
              >
                Yes, Cancel Test
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
