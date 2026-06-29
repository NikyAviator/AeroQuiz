import { ClockIcon } from '@heroicons/react/24/outline';

// QuizTimer — pure display component.
// Receives timeLeft in seconds from QuizPage and formats it as MM:SS.
// Turns yellow under 5 minutes and red under 1 minute as a visual warning.
//
// Props:
//   timeLeft → integer, seconds remaining (e.g. 2700 = 45:00)

export default function QuizTimer({ timeLeft }) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Pad single digit seconds with a leading zero: 4 → "04"
  const formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  // Colour shifts as time runs low — gives the pilot a clear visual warning
  const colorClass =
    timeLeft <= 60
      ? 'text-red-500 dark:text-red-400' // under 1 minute — red
      : timeLeft <= 300
        ? 'text-yellow-500 dark:text-yellow-400' // under 5 minutes — yellow
        : 'text-gray-700 dark:text-gray-200'; // normal — neutral

  return (
    <div
      className={`flex items-center gap-1.5 font-mono text-lg font-semibold ${colorClass}`}
    >
      <ClockIcon className="size-5 shrink-0" />
      <span>{formatted}</span>
    </div>
  );
}
