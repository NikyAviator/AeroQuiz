import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// QuizProgress — pure display component.
// Shows current question, dot indicators and prev/next arrows.
// Dot colours:
//   current    → indigo with ring
//   answered   → solid indigo
//   unanswered → gray (light) / white/20 (dark)

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
    <nav aria-label="Quiz progress">
      {/* ── Row 1: arrows + step label ── */}
      <div className="flex items-center justify-between">
        <button
          onClick={onPrev}
          disabled={isFirst}
          aria-label="Previous question"
          className="flex size-8 items-center justify-center rounded-full transition-colors enabled:hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-30 dark:enabled:hover:bg-white/10"
        >
          <ChevronLeftIcon className="size-5 text-gray-700 dark:text-white" />
        </button>

        <p className="text-sm font-medium text-gray-700 dark:text-white">
          Question {current + 1} of {total}
        </p>

        <button
          onClick={onNext}
          disabled={isLast}
          aria-label="Next question"
          className="flex size-8 items-center justify-center rounded-full transition-colors enabled:hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-30 dark:enabled:hover:bg-white/10"
        >
          <ChevronRightIcon className="size-5 text-gray-700 dark:text-white" />
        </button>
      </div>

      {/* ── Row 2: dots on their own line so they never push arrows off screen ── */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
        {questions.map((q, i) => {
          const isAnswered = !!answers[q.id];
          const isCurrent = i === current;

          if (isCurrent) {
            return (
              <span
                key={q.id}
                aria-current="step"
                aria-label={`Question ${i + 1} (current)`}
                className="relative flex items-center justify-center"
              >
                <span aria-hidden="true" className="absolute flex size-5 p-px">
                  <span className="size-full rounded-full bg-indigo-200 dark:bg-indigo-900" />
                </span>
                <span
                  aria-hidden="true"
                  className="relative block size-2.5 rounded-full bg-indigo-500"
                />
              </span>
            );
          }

          if (isAnswered) {
            return (
              <span
                key={q.id}
                aria-label={`Question ${i + 1} (answered)`}
                className="block size-2.5 rounded-full bg-indigo-500"
              />
            );
          }

          return (
            <span
              key={q.id}
              aria-label={`Question ${i + 1} (unanswered)`}
              className="block size-2.5 rounded-full bg-gray-300 dark:bg-white/20"
            />
          );
        })}
      </div>
    </nav>
  );
}
