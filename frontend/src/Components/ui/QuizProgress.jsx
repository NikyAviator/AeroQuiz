import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// QuizProgress — pure display component.
// Shows the current question number, dot indicators, and prev/next arrows.
// Dot colours reflect answer state:
//   answered   → indigo (solid)
//   current    → indigo with ring (highlighted)
//   unanswered → white/15 (empty)
//
// Props:
//   current   → 0-based index of the current question
//   total     → total number of questions (20)
//   answers   → object { [questionId]: "a" | "b" | "c" | "d" }
//   questions → array of question objects (used to check if answered)
//   onPrev    → called when left arrow clicked
//   onNext    → called when right arrow clicked

export default function QuizProgress({
  current,
  total,
  answers,
  questions,
  onPrev,
  onNext,
}) {
  const isFirst = current === 0;
  const isLast = current === total - 1;

  return (
    <nav
      aria-label="Quiz progress"
      className="flex items-center justify-between"
    >
      {/* ── Left arrow ── */}
      <button
        onClick={onPrev}
        disabled={isFirst}
        aria-label="Previous question"
        className="flex size-8 items-center justify-center rounded-full transition-colors duration-150 enabled:hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronLeftIcon className="size-5 text-white" />
      </button>

      {/* ── Step label + dots ── */}
      <div className="flex items-center gap-4">
        <p className="text-sm font-medium text-white">
          Question {current + 1} of {total}
        </p>

        <ol role="list" className="flex items-center gap-1.5">
          {questions.map((q, i) => {
            const isAnswered = !!answers[q.id];
            const isCurrent = i === current;

            return (
              <li key={q.id}>
                {isCurrent ? (
                  // Current question — indigo dot with outer ring
                  <button
                    onClick={() => {}} // already here, no-op
                    aria-current="step"
                    aria-label={`Question ${i + 1} (current)`}
                    className="relative flex items-center justify-center"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute flex size-5 p-px"
                    >
                      <span className="size-full rounded-full bg-indigo-900" />
                    </span>
                    <span
                      aria-hidden="true"
                      className="relative block size-2.5 rounded-full bg-indigo-400"
                    />
                  </button>
                ) : isAnswered ? (
                  // Answered — solid indigo dot, clickable to jump back
                  <button
                    onClick={() => {
                      // Jump to this question — QuizPage handles navigation
                      // by passing an onJump prop in a future iteration.
                      // For now dots are visual only.
                    }}
                    aria-label={`Question ${i + 1} (answered)`}
                    className="block size-2.5 rounded-full bg-indigo-500 hover:bg-indigo-400"
                  />
                ) : (
                  // Unanswered — hollow dot
                  <span
                    aria-label={`Question ${i + 1} (unanswered)`}
                    className="block size-2.5 rounded-full bg-white/20"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* ── Right arrow ── */}
      <button
        onClick={onNext}
        disabled={isLast}
        aria-label="Next question"
        className="flex size-8 items-center justify-center rounded-full transition-colors duration-150 enabled:hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronRightIcon className="size-5 text-white" />
      </button>
    </nav>
  );
}
