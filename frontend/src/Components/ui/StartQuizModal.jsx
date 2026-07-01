import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import {
  ClipboardDocumentListIcon,
  ClockIcon,
  CheckBadgeIcon,
  PaperAirplaneIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

// StartQuizModal — confirmation gate before a quiz begins.
//
// Two modes controlled by the `hasSession` prop:
//
//   hasSession = false (normal flow)
//     → Shows test conditions + "Begin Test →" button
//
//   hasSession = true (resume flow)
//     → Shows "Test in progress" notice + "Resume Test" and "Start New Test" buttons
//
// Props:
//   subject    → the full subject object from the subjects array, or null
//   open       → boolean — whether the modal is visible
//   hasSession → boolean — whether an active session exists in sessionStorage
//   onClose    → called when user cancels or clicks outside
//   onConfirm  → called when user clicks "Begin Test →" (no session)
//   onResume   → called when user clicks "Resume Test" (has session)
//   onStartNew → called when user clicks "Start New Test" (has session)

export default function StartQuizModal({
  subject,
  open,
  hasSession,
  onClose,
  onConfirm,
  onResume,
  onStartNew,
}) {
  if (!subject) return null;

  return (
    <Dialog open={open} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in fixed inset-0 bg-gray-900/75 transition-opacity"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <DialogPanel
            transition
            className="data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in data-closed:sm:translate-y-0 data-closed:sm:scale-95 relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all dark:bg-gray-900 sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
          >
            {/* Icon */}
            <div
              className={`mx-auto flex size-12 items-center justify-center rounded-full ${
                hasSession
                  ? 'bg-yellow-100 dark:bg-yellow-900/40'
                  : 'bg-indigo-100 dark:bg-indigo-900/40'
              }`}
            >
              {hasSession ? (
                <ArrowPathIcon className="size-6 text-yellow-600 dark:text-yellow-400" />
              ) : (
                <PaperAirplaneIcon className="size-6 text-indigo-600 dark:text-indigo-400" />
              )}
            </div>

            {/* Title */}
            <div className="mt-4 text-center">
              <DialogTitle
                as="h3"
                className="text-xl font-bold text-gray-900 dark:text-white"
              >
                {subject.name}
              </DialogTitle>

              {hasSession ? (
                // ── Resume mode ──────────────────────────────────────────────
                <>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    You have a test in progress for this subject.
                  </p>
                  <div className="mt-6 rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
                    Would you like to continue where you left off, or start a
                    fresh test with new questions? Starting a new test will
                    discard your current progress.
                  </div>

                  <div className="mt-6 flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={onResume}
                      className="inline-flex w-full justify-center rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-yellow-400 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                      Resume Test →
                    </button>
                    <button
                      type="button"
                      onClick={onStartNew}
                      className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-600 dark:hover:bg-gray-700"
                    >
                      Start New Test
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="text-sm text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                // ── Normal mode ──────────────────────────────────────────────
                <>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    You are about to start a practice test. Read the conditions
                    below before you begin.
                  </p>

                  {/* Test conditions */}
                  <div className="mt-6 space-y-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <ClipboardDocumentListIcon className="size-5 shrink-0 text-indigo-500" />
                      <span>
                        <span className="font-semibold">20 questions</span>{' '}
                        selected at random from {subject.questionCount} in the
                        bank
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <ClockIcon className="size-5 shrink-0 text-indigo-500" />
                      <span>
                        <span className="font-semibold">45 minutes</span> to
                        complete — timer starts when you click Begin Test
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <CheckBadgeIcon className="size-5 shrink-0 text-indigo-500" />
                      <span>
                        <span className="font-semibold">Pass mark: 75%</span> —
                        you need 15 or more correct answers to pass
                      </span>
                    </div>
                  </div>

                  <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
                    If time runs out before you submit, your progress will still
                    be recorded.
                  </p>

                  {/* Action buttons */}
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-600 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={onConfirm}
                      className="inline-flex w-full justify-center rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-yellow-400 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                      Begin Test →
                    </button>
                  </div>
                </>
              )}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
