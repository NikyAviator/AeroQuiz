import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import QuizTimer from '../../Components/ui/QuizTimer.jsx';
import QuizProgress from '../../Components/ui/QuizProgress.jsx';

const TOTAL_TIME = 45 * 60; // 2700 seconds

export default function QuizPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const subject = searchParams.get('subject') ?? '';

  // ── State ──────────────────────────────────────────────────────────────────
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const submitRef = useRef(null);

  // ── Fetch questions on mount ───────────────────────────────────────────────
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch(
          `/api/v1/quiz/start?subject=${encodeURIComponent(subject)}`,
          { credentials: 'include' },
        );
        if (!res.ok) throw new Error('Could not load questions');
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (subject) fetchQuestions();
  }, [subject]);

  // ── Submit handler ─────────────────────────────────────────────────────────
  const handleSubmit = useCallback(
    async (dnf = false) => {
      if (submitting) return;
      setSubmitting(true);

      const answersArray = questions.map((q) => ({
        questionId: q.id,
        given: answers[q.id] ?? '',
      }));

      try {
        const res = await fetch('/api/v1/quiz/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            subject,
            answers: answersArray,
            timeTaken: TOTAL_TIME - timeLeft,
            dnf,
          }),
        });
        if (!res.ok) throw new Error('Could not submit quiz');
        const result = await res.json();
        navigate('/result', { state: { result, questions } });
      } catch (err) {
        setError(err.message);
        setSubmitting(false);
      }
    },
    [submitting, questions, answers, subject, timeLeft, navigate],
  );

  useEffect(() => {
    submitRef.current = handleSubmit;
  }, [handleSubmit]);

  // ── Countdown timer ────────────────────────────────────────────────────────
  useEffect(() => {
    if (loading || questions.length === 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          submitRef.current(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [loading, questions.length]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  function handleSelectAnswer(questionId, key) {
    setAnswers((prev) => ({ ...prev, [questionId]: key }));
  }
  function handlePrev() {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }
  function handleNext() {
    setCurrentIndex((i) => Math.min(questions.length - 1, i + 1));
  }

  // ── Derived ────────────────────────────────────────────────────────────────
  const answeredCount = Object.keys(answers).length;
  const allAnswered =
    answeredCount === questions.length && questions.length > 0;
  const currentQuestion = questions[currentIndex];

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <svg
            className="mx-auto h-10 w-10 animate-spin text-indigo-400"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
            />
          </svg>
          <p className="mt-4 text-gray-400">Loading questions…</p>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 bg-gray-800 px-4 py-2 text-sm font-semibold text-yellow-400 hover:bg-gray-700"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ── Quiz UI ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* ── Top bar: progress dots only ── */}
        <div className="mb-8 rounded-lg bg-gray-200 px-6 py-4 dark:bg-gray-800">
          <QuizProgress
            current={currentIndex}
            total={questions.length}
            answers={answers}
            questions={questions}
            onPrev={handlePrev}
            onNext={handleNext}
          />
          <p className="mt-3 text-center text-xs text-gray-500">
            {answeredCount} of {questions.length} questions answered
          </p>
        </div>

        {/* ── Question card ── */}
        {currentQuestion && (
          <div className="rounded-lg bg-white dark:bg-gray-800">
            {/* Header */}
            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <span className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
                {subject}
              </span>
              <h2 className="mt-2 text-lg font-semibold leading-relaxed text-gray-900 dark:text-white">
                {currentQuestion.text}
              </h2>
              {currentQuestion.imageUrl && (
                <img
                  src={currentQuestion.imageUrl}
                  alt="Question illustration"
                  className="mt-4 max-h-64 w-full rounded-md object-contain"
                />
              )}
            </div>

            {/* Answer options */}
            <fieldset
              aria-label="Answer options"
              className="divide-y divide-gray-200 dark:divide-gray-700"
            >
              {currentQuestion.answers.map((answer) => {
                const selected =
                  answers[currentQuestion.id] === answer.key.toLowerCase();
                return (
                  <label
                    key={answer.key.toLowerCase()}
                    className={`flex cursor-pointer items-center gap-4 px-6 py-4 transition-colors duration-100 ${
                      selected
                        ? 'bg-indigo-50 dark:bg-indigo-900/30'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/40'
                    } last:rounded-b-lg`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={answer.key.toLowerCase()}
                      checked={selected}
                      onChange={() =>
                        handleSelectAnswer(
                          currentQuestion.id,
                          answer.key.toLowerCase(),
                        )
                      }
                      className="sr-only"
                    />
                    {/* Custom radio circle */}
                    <span
                      className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        selected
                          ? 'border-indigo-600 bg-indigo-600 dark:border-indigo-400 dark:bg-indigo-400'
                          : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900'
                      }`}
                    >
                      {selected && (
                        <span className="size-2 rounded-full bg-white" />
                      )}
                    </span>
                    {/* Key badge */}
                    <span
                      className={`flex size-7 shrink-0 items-center justify-center rounded text-sm font-bold uppercase ${
                        selected
                          ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {answer.key.toLowerCase()}
                    </span>
                    {/* Answer text */}
                    <span
                      className={`text-sm leading-relaxed ${
                        selected
                          ? 'font-medium text-indigo-900 dark:text-indigo-100'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {answer.text}
                    </span>
                  </label>
                );
              })}
            </fieldset>
          </div>
        )}

        {/* ── Bottom navigation — Prev | Timer | Next/Submit ── */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="bg-gray-200 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            ← Previous
          </button>

          {/* Timer centred between the two nav buttons */}
          <QuizTimer timeLeft={timeLeft} />

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="bg-gray-200 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              className={`px-6 py-2 text-sm font-semibold transition-colors ${
                allAnswered
                  ? 'bg-gray-900 text-yellow-400 hover:bg-gray-800'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {submitting
                ? 'Submitting…'
                : allAnswered
                  ? 'Submit Test →'
                  : `Submit (${answeredCount}/${questions.length} answered)`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
