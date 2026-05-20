import { Link } from 'react-router-dom';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

export default function HomePageTop() {
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="bg-linear-to-b relative isolate overflow-hidden from-indigo-100/20 dark:from-indigo-900/20">
        <div className="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40">
          {/* ── Left: Text content ── */}
          <div className="px-6 lg:px-0 lg:pt-4">
            <div className="mx-auto max-w-2xl">
              <div className="max-w-lg">
                {/* Airplane logo */}
                <PaperAirplaneIcon className="h-12 w-12 text-indigo-600" />

                {/* Heading */}
                <h1 className="mt-10 text-pretty text-5xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
                  Welcome to AeroQuiz!
                </h1>

                {/* Description */}
                <p className="mt-8 text-pretty text-lg font-medium text-gray-500 dark:text-gray-400 sm:text-xl/8">
                  A platform designed to help you pass your aeronautical
                  knowledge exams with confidence. Whether you're a student
                  pilot or an experienced aviator, AeroQuiz has the practice
                  questions to get you ready for your future exams and
                  endeavours.
                </p>

                {/* CTAs */}
                <div className="mt-10 flex items-center gap-x-6">
                  <Link
                    to="/register"
                    className="shadow-xs rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Get Started
                  </Link>
                  <a
                    href="https://github.com/NikyAviator/AeroQuiz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm/6 font-semibold text-gray-900 dark:text-gray-100"
                  >
                    View on GitHub <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Hero image ── */}
          <div className="mt-20 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen">
            {/* Decorative background skew */}
            <div
              aria-hidden="true"
              className="absolute inset-y-0 right-1/2 -z-10 -mr-10 w-[200%] skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 dark:bg-gray-900 dark:shadow-indigo-900/20 dark:ring-indigo-900/30 md:-mr-20 lg:-mr-36"
            />

            <div className="shadow-lg md:rounded-3xl">
              <div className="bg-indigo-500 [clip-path:inset(0)] dark:bg-indigo-800 md:[clip-path:inset(0_round_var(--radius-3xl))]">
                <div
                  aria-hidden="true"
                  className="inset-ring inset-ring-white absolute -inset-y-px left-1/2 -z-10 ml-10 w-[200%] skew-x-[-30deg] bg-indigo-100 opacity-20 md:ml-20 lg:ml-36"
                />

                {/* pic1.jpg as the hero visual */}
                <div className="relative px-6 pt-8 sm:pt-16 md:pl-16 md:pr-0">
                  <div className="mx-auto max-w-2xl md:mx-0 md:max-w-none">
                    <div className="w-screen overflow-hidden rounded-tl-xl">
                      <img
                        src="/images/pic1.jpg"
                        alt="Aviation hero"
                        className="object-cover object-center"
                        style={{ maxHeight: '420px' }}
                      />
                    </div>
                  </div>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 md:rounded-3xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="bg-linear-to-t absolute inset-x-0 bottom-0 -z-10 h-24 from-white dark:from-gray-900 sm:h-32" />
      </div>
    </div>
  );
}
