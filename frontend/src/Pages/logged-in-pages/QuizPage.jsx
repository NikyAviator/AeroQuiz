import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import QuizTimer from '../../Components/ui/QuizTimer.jsx';
import QuizProgress from '../../Components/ui/QuizProgress.jsx';
import CancelTestModal from '../../Components/ui/CancelTestModal.jsx';

const TOTAL_TIME = 45 * 60; // 2700 seconds

function storageKey(subject) {
  return `quiz_session_${subject}`;
}

function loadSession(subject) {
  try {
    const raw = sessionStorage.getItem(storageKey(subject));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveSession(subject, data) {
  try {
    sessionStorage.setItem(storageKey(subject), JSON.stringify(data));
  } catch {
    // sessionStorage can fail in private browsing / quota exceeded —
    // fail silently, the quiz still works, it just won't survive a refresh.
  }
}

function clearSession(subject) {
  sessionStorage.removeItem(storageKey(subject));
}

export default function QuizPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const subject = searchParams.get('subject') ?? '';

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [startedAt, setStartedAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const submitRef = useRef(null);

  useEffect(() => {
    if (!subject) return;

    async function init() {
      const saved = loadSession(subject);

      if (saved) {
        const elapsed = Math.floor((Date.now() - saved.startedAt) / 1000);
        const remaining = Math.max(0, TOTAL_TIME - elapsed);

        setQuestions(saved.questions);
        setAnswers(saved.answers);
        setCurrentIndex(saved.currentIndex);
        setStartedAt(saved.startedAt);
        setTimeLeft(remaining);
        setLoading(false);

        if (remaining <= 0) {
          submitRef.current?.(true);
        }
        return;
      }

      try {
        const res = await fetch(
          `/api/v1/quiz/start?subject=${encodeURIComponent(subject)}`,
          { credentials: 'include' },
        );
        if (!res.ok) throw new Error('Could not load questions');
        const data = await res.json();
        const now = Date.now();

        setQuestions(data);
        setStartedAt(now);
        saveSession(subject, {
          questions: data,
          answers: {},
          currentIndex: 0,
          startedAt: now,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [subject]);

  useEffect(() => {
    if (loading || questions.length === 0 || !startedAt) return;
    saveSession(subject, { questions, answers, currentIndex, startedAt });
  }, [subject, questions, answers, currentIndex, startedAt, loading]);

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

        clearSession(subject);
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

  function handleSelectAnswer(questionId, key) {
    setAnswers((prev) => ({ ...prev, [questionId]: key }));
  }
  function handlePrev() {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }
  function handleNext() {
    setCurrentIndex((i) => Math.min(questions.length - 1, i + 1));
  }

  function handleCancelConfirm() {
    clearSession(subject);
    navigate('/dashboard');
  }

  const answeredCount = Object.keys(answers).length;
  const allAnswered =
    answeredCount === questions.length && questions.length > 0;
  const currentQuestion = questions[currentIndex];

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

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
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

        {currentQuestion && (
          <div className="rounded-lg bg-white dark:bg-gray-800">
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
                    <span
                      className={`flex size-7 shrink-0 items-center justify-center rounded text-sm font-bold uppercase ${
                        selected
                          ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {answer.key.toLowerCase()}
                    </span>
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

        <div className="mt-6 flex items-center justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="bg-gray-200 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            ← Previous
          </button>

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

        <div className="mt-4 text-center">
          <button
            onClick={() => setShowCancelModal(true)}
            className="text-sm font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
          >
            Cancel Test
          </button>
        </div>
      </div>

      <CancelTestModal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelConfirm}
      />
    </div>
  );
}
