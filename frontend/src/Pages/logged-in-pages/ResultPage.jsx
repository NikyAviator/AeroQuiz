import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Formats seconds into MM:SS display string
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Result constants — must match backend QuizResult enum exactly
const PASS = 'PASS';
const DNF_PASSED = 'DNF_PASSED';

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // QuizPage passes { result, questions } via navigate state
  const { result: initialResult, questions } = location.state ?? {};

  const [result, setResult] = useState(initialResult ?? null);
  const [loading, setLoading] = useState(!initialResult);
  const [error, setError] = useState('');

  // If result is missing from router state (e.g. user refreshed ResultPage),
  // we can't recover without a result ID — send them back to dashboard.
  useEffect(() => {
    if (!initialResult) {
      navigate('/dashboard', { replace: true });
    }
  }, [initialResult, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-gray-400">Loading result…</p>
      </div>
    );
  }

  if (error || !result || !questions) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-400">{error || 'Result not found.'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 bg-gray-900 px-4 py-2 text-sm font-semibold text-yellow-400 hover:bg-gray-800"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ── Derived display values ─────────────────────────────────────────────────
  const passed = result.result === PASS || result.result === DNF_PASSED;
  const dnf =
    result.result === DNF_PASSED || result.result === 'DNF_DID_NOT_PASS';

  // Build a lookup map: questionId → graded answer
  // so we can match each question to its result efficiently
  const answerMap = {};
  for (const a of result.answers) {
    // questionId comes back as an object {$oid:"..."} or string depending on Go serialisation
    const id =
      typeof a.questionId === 'object' ? a.questionId.$oid : a.questionId;
    answerMap[id] = a;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* ── Result heading ── */}
        <div
          className={`rounded-lg px-6 py-8 text-center shadow-sm ${
            passed
              ? 'bg-green-50 dark:bg-green-900/20'
              : 'bg-red-50 dark:bg-red-900/20'
          }`}
        >
          <h1
            className={`text-3xl font-extrabold tracking-tight ${
              passed
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {passed ? '✓ PASSED!' : '✗ DID NOT PASS'}
          </h1>

          <p
            className={`mt-2 text-5xl font-black ${
              passed
                ? 'text-green-700 dark:text-green-300'
                : 'text-red-700 dark:text-red-300'
            }`}
          >
            {result.score}/{questions.length}
          </p>

          <p className="mt-1 text-lg font-semibold text-gray-700 dark:text-gray-300">
            {result.subject}
          </p>

          {dnf && (
            <p className="mt-2 text-sm text-orange-600 dark:text-orange-400">
              ⏱ Time ran out before you submitted
            </p>
          )}

          <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <span>Time taken: {formatTime(result.timeTaken)}</span>
            <span>Pass mark: 15/20 (75%)</span>
          </div>
        </div>

        {/* ── Back button ── */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-900 px-6 py-2 text-sm font-semibold text-yellow-400 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* ── Answer breakdown ── */}
        <div className="mt-8 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Answer Breakdown
          </h2>

          {questions.map((q, i) => {
            const graded = answerMap[q.id];
            const userGave = graded?.given ?? '';
            const correctKey = graded?.correctKey ?? '';
            const wasCorrect = graded?.correct ?? false;

            return (
              <div
                key={q.id}
                className={`overflow-hidden rounded-lg border bg-white dark:bg-gray-800 ${
                  wasCorrect
                    ? 'border-green-200 dark:border-green-800'
                    : 'border-red-200 dark:border-red-800'
                }`}
              >
                {/* Question header */}
                <div
                  className={`flex items-start gap-3 border-b px-5 py-4 ${
                    wasCorrect
                      ? 'border-green-100 bg-green-50 dark:border-green-900 dark:bg-green-900/10'
                      : 'border-red-100 bg-red-50 dark:border-red-900 dark:bg-red-900/10'
                  }`}
                >
                  <span
                    className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                      wasCorrect ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  >
                    {wasCorrect ? '✓' : '✗'}
                  </span>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
                      Question {i + 1}
                    </span>
                    <p className="mt-0.5 text-sm font-semibold leading-relaxed text-gray-900 dark:text-white">
                      {q.text}
                    </p>
                  </div>
                </div>

                {/* Answer options */}
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {q.answers.map((answer) => {
                    const key = answer.key.toLowerCase();
                    const isCorrect = key === correctKey.toLowerCase();
                    const isUserPick = key === userGave.toLowerCase();
                    const isWrongPick = isUserPick && !wasCorrect;

                    let rowClass = 'flex items-center gap-3 px-5 py-3 text-sm ';
                    let keyClass =
                      'flex size-7 shrink-0 items-center justify-center rounded text-xs font-bold uppercase ';
                    let textClass = 'text-sm ';

                    if (isCorrect) {
                      // Always highlight the correct answer green
                      rowClass += 'bg-green-50 dark:bg-green-900/20';
                      keyClass += 'bg-green-500 text-white';
                      textClass +=
                        'font-semibold text-green-800 dark:text-green-300';
                    } else if (isWrongPick) {
                      // User chose this but it was wrong — red
                      rowClass += 'bg-red-50 dark:bg-red-900/20';
                      keyClass += 'bg-red-500 text-white';
                      textClass +=
                        'font-semibold text-red-800 dark:text-red-300';
                    } else {
                      // Neutral answer
                      rowClass += '';
                      keyClass +=
                        'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400';
                      textClass += 'text-gray-600 dark:text-gray-400';
                    }

                    return (
                      <div key={key} className={rowClass}>
                        <span className={keyClass}>{key}</span>
                        <span className={textClass}>{answer.text}</span>
                        {/* Label: what the user chose */}
                        {isUserPick && (
                          <span
                            className={`ml-auto text-xs font-medium ${
                              wasCorrect
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {wasCorrect ? 'Your answer ✓' : 'Your answer ✗'}
                          </span>
                        )}
                        {/* Label: correct answer when user was wrong */}
                        {isCorrect && !wasCorrect && !isUserPick && (
                          <span className="ml-auto text-xs font-medium text-green-600 dark:text-green-400">
                            Correct answer
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Bottom back button ── */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-900 px-6 py-2 text-sm font-semibold text-yellow-400 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
