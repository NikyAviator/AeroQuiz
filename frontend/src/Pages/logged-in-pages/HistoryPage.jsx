import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components — required before any chart renders.
// Without this, charts render blank with no error message.
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatDate(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// Result badge colours
function resultBadge(result) {
  switch (result) {
    case 'PASS':
      return {
        label: 'PASS',
        cls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      };
    case 'DID_NOT_PASS':
      return {
        label: 'DID NOT PASS',
        cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      };
    case 'DNF_PASSED':
      return {
        label: 'PASS (DNF)',
        cls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      };
    case 'DNF_DID_NOT_PASS':
      return {
        label: 'DID NOT PASS (DNF)',
        cls: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      };
    default:
      return {
        label: result,
        cls: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
      };
  }
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-sm dark:bg-gray-800">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-3xl font-extrabold text-gray-900 dark:text-white">
        {value}
      </p>
      {sub && (
        <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{sub}</p>
      )}
    </div>
  );
}

// ── HistoryPage ───────────────────────────────────────────────────────────────
export default function HistoryPage() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ── Fetch all results for the logged-in user ──────────────────────────────
  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch('/api/v1/quiz/history', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Could not load history');
        const data = await res.json();
        // Backend returns newest first — reverse for chronological chart
        setResults(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
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
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-400">{error}</p>
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

  // ── Empty state ───────────────────────────────────────────────────────────
  if (results.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            No tests taken yet.
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Complete your first quiz to see your history here.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-6 bg-gray-900 px-5 py-2 text-sm font-semibold text-yellow-400 hover:bg-gray-800"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ── Derived stats ─────────────────────────────────────────────────────────
  // Results come newest-first from the API — reverse for the chart so time
  // flows left → right
  const chronological = [...results].reverse();

  const totalTests = results.length;
  const bestScore = Math.max(...results.map((r) => r.score));
  const avgScore = (
    results.reduce((sum, r) => sum + r.score, 0) / totalTests
  ).toFixed(1);
  const passCount = results.filter((r) => r.passed).length;
  const passRate = Math.round((passCount / totalTests) * 100);

  // ── Chart data ────────────────────────────────────────────────────────────
  const chartLabels = chronological.map((r) => formatDate(r.submittedAt));
  const chartScores = chronological.map((r) => r.score);
  const pointColors = chronological.map((r) =>
    r.passed ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
  );

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Score',
        data: chartScores,
        borderColor: 'rgb(99, 102, 241)', // indigo line
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        pointBackgroundColor: pointColors, // green = pass, red = fail
        pointBorderColor: pointColors,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.3, // slight curve on the line
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `Score: ${ctx.parsed.y}/20`,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 20,
        ticks: { stepSize: 5, color: '#9ca3af' },
        grid: { color: 'rgba(156,163,175,0.15)' },
        // Dashed pass mark line at 15
        afterDataLimits(scale) {
          scale.max = 20;
        },
      },
      x: {
        ticks: { color: '#9ca3af', maxRotation: 30 },
        grid: { display: false },
      },
    },
    // Draw dashed pass-mark line at y=15
    plugins: {
      annotation: undefined, // no annotation plugin needed — we draw it manually below
    },
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* ── Page header ── */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Test History
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Your performance across all practice tests
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-900 px-4 py-2 text-sm font-semibold text-yellow-400 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            ← Dashboard
          </button>
        </div>

        {/* ── Stat cards ── */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Total Tests" value={totalTests} />
          <StatCard label="Best Score" value={`${bestScore}/20`} />
          <StatCard label="Average Score" value={`${avgScore}/20`} />
          <StatCard
            label="Pass Rate"
            value={`${passRate}%`}
            sub={`${passCount} of ${totalTests} passed`}
          />
        </div>

        {/* ── Line chart ── */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Score Trend
            </h2>
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="inline-block size-2.5 rounded-full bg-green-500" />
                Pass
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block size-2.5 rounded-full bg-red-500" />
                Fail
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-px w-6 border-t-2 border-dashed border-gray-400" />
                Pass mark (15)
              </span>
            </div>
          </div>

          {/* Pass mark annotation drawn as a simple HR overlay */}
          <div className="relative">
            <Line data={chartData} options={chartOptions} />
            {/* Dashed pass-mark line — positioned at 25% from bottom (15/20 = 75%) */}
            <div
              className="pointer-events-none absolute left-12 right-0 border-t-2 border-dashed border-yellow-400/60"
              style={{ bottom: 'calc(10px + 75% - 0px)' }}
            />
          </div>
        </div>

        {/* ── History table ── */}
        <div className="rounded-lg bg-white shadow-sm dark:bg-gray-800">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              All Tests
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Result
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Time Taken
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {results.map((r) => {
                  const badge = resultBadge(r.result);
                  return (
                    <tr
                      key={r.id}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/40"
                    >
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {formatDate(r.submittedAt)}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {r.subject}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`font-bold ${
                            r.passed
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {r.score}/20
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.cls}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {formatTime(r.timeTaken)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
