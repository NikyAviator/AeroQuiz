import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Components/hooks/useAuth.jsx';
import StartQuizModal from '../../Components/ui/StartQuizModal.jsx';

// ── Subject data ──────────────────────────────────────────────────────────────
// questionCount: hardcoded for now — will be fetched from
// GET /api/v1/quiz/subjects once that endpoint is built.
// available: false = "Coming Soon" — no Start Quiz button shown.
const subjects = [
  {
    id: 1,
    name: 'Meteorology',
    subject: 'Meteorology',
    description:
      'Atmosphere, pressure, temperature, winds, clouds and weather phenomena. Essential knowledge for safe flight planning.',
    questionCount: 70,
    available: true,
    imageSrc:
      'https://images.unsplash.com/photo-1561470508-fd4df1ed90b2?q=80&w=2676&auto=format&fit=crop',
    imageAlt: 'Dramatic storm clouds photographed from above',
  },
  {
    id: 2,
    name: 'Air Law',
    subject: 'Air Law',
    description:
      'International and national regulations, rules of the air, air traffic services and aviation authorities.',
    questionCount: 0,
    available: false,
    imageSrc:
      'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2674&auto=format&fit=crop',
    imageAlt: 'Aircraft at an airport',
  },
  {
    id: 3,
    name: 'Navigation',
    subject: 'Navigation',
    description:
      'Charts, instruments, radio navigation, GPS and dead reckoning. Find your way anywhere in the world.',
    questionCount: 0,
    available: false,
    imageSrc:
      'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?q=80&w=2670&auto=format&fit=crop',
    imageAlt: 'Aeronautical chart with compass',
  },
  {
    id: 4,
    name: 'Principles of Flight',
    subject: 'Principles of Flight',
    description:
      'Aerodynamics, lift, drag, thrust and performance. Understand why aircraft fly.',
    questionCount: 0,
    available: false,
    imageSrc:
      'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?q=80&w=2670&auto=format&fit=crop',
    imageAlt: 'Aircraft wing in flight',
  },
  {
    id: 5,
    name: 'Aircraft General Knowledge',
    subject: 'Aircraft General Knowledge',
    description:
      'Airframes, engines, systems and instruments. Know your aircraft inside and out.',
    questionCount: 0,
    available: false,
    imageSrc:
      'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2574&auto=format&fit=crop',
    imageAlt: 'Aircraft cockpit instruments',
  },
  {
    id: 6,
    name: 'Human Performance',
    subject: 'Human Performance',
    description:
      'Physiology, psychology and crew resource management. The human factor in aviation safety.',
    questionCount: 0,
    available: false,
    imageSrc:
      'https://images.unsplash.com/photo-1559598467-f8b76c8155d0?q=80&w=2670&auto=format&fit=crop',
    imageAlt: 'Pilot in cockpit',
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // selectedSubject drives the modal — null = closed, object = open
  const [selectedSubject, setSelectedSubject] = useState(null);

  function handleOpenModal(subject) {
    setSelectedSubject(subject);
  }

  function handleCloseModal() {
    setSelectedSubject(null);
  }

  function handleConfirm() {
    if (!selectedSubject) return;
    navigate(`/quiz?subject=${encodeURIComponent(selectedSubject.subject)}`);
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* ── Page header ── */}
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.username}! ✈
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Choose a subject to start a practice test. Each session gives you 20
          random questions and 45 minutes to complete them.
        </p>
      </div>

      {/* ── Subject grid ── */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
          {subjects.map((s) => (
            <div
              key={s.id}
              className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              {/* Subject image */}
              <div className="overflow-hidden sm:h-56">
                <img
                  alt={s.imageAlt}
                  src={s.imageSrc}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Card body */}
              <div className="flex flex-1 flex-col space-y-3 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {s.name}
                  </h3>
                  <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                    {s.questionCount > 0
                      ? `${s.questionCount} questions`
                      : 'Coming soon'}
                  </span>
                </div>

                <p className="flex-1 text-sm text-gray-500 dark:text-gray-400">
                  {s.description}
                </p>

                {s.available ? (
                  <button
                    onClick={() => handleOpenModal(s)}
                    className="mt-2 w-full bg-gray-900 px-4 py-2 text-sm font-semibold text-yellow-400 transition-colors duration-150 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    Start Quiz →
                  </button>
                ) : (
                  <div className="mt-2 w-full cursor-not-allowed bg-gray-100 px-4 py-2 text-center text-sm font-semibold text-gray-400 dark:bg-gray-700/50 dark:text-gray-500">
                    Coming Soon
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Confirmation modal ── */}
      <StartQuizModal
        subject={selectedSubject}
        open={!!selectedSubject}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
