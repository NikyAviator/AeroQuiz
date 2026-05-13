// 'use client' is a Next.js directive — not needed in Vite/React, safe to remove
import { useCallback, useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';
import useDarkMode from './hooks/useDarkMode';
import { Link } from 'react-router-dom';

// All nav links defined in one place — easy to add/remove links here
const navLinks = [
  { to: '/', label: 'Home' },
  // { to: '/about', label: 'About' },
  // { to: '/services', label: 'Services' },
  // { to: '/blog', label: 'Blog' },
];

// Reusable link style — apply to both desktop and mobile links
const linkClass =
  'rounded-full bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-150';

export default function Header() {
  const [dark, setDark] = useDarkMode();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleTheme = useCallback(() => setDark((d) => !d), [setDark]);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <header className="border-b border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8"
      >
        {/* ── 1. Brand (always left) ── */}
        <Link
          to="/"
          className="-m-1.5 p-1.5 text-xl font-bold text-yellow-500 transition-colors duration-150 hover:text-yellow-400"
          onClick={closeMobile}
        >
          AeroQuiz
        </Link>

        {/* ── 2. Desktop nav links (center, hidden on mobile) ── */}
        <div className="hidden lg:flex lg:items-center lg:gap-3">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} className={linkClass}>
              {label}
            </Link>
          ))}
        </div>

        {/* ── 3. Right side controls (always visible) ── */}
        <div className="flex items-center gap-2">
          {/* Theme toggle — one button, works for both desktop and mobile */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-md p-2 text-indigo-600 ring-1 ring-indigo-600/30 transition-colors duration-150 hover:bg-indigo-600/10 dark:text-indigo-400"
          >
            {dark ? (
              <SunIcon className="size-5" />
            ) : (
              <MoonIcon className="size-5" />
            )}
          </button>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="rounded-md p-2 text-indigo-600 transition-colors duration-150 hover:bg-indigo-600/10 lg:hidden"
          >
            <Bars3Icon className="size-6" />
          </button>
        </div>
      </nav>

      {/* ── Mobile slide-in dialog ── */}
      <Dialog open={mobileOpen} onClose={closeMobile} className="lg:hidden">
        {/* Dim backdrop */}
        <div className="fixed inset-0 z-10 bg-black/40" />

        <DialogPanel className="fixed inset-y-0 right-0 z-20 w-full max-w-sm overflow-y-auto bg-white px-6 py-6 dark:bg-gray-900 sm:ring-1 sm:ring-gray-900/10">
          {/* Top row: brand (left) — close button (right) */}
          <div className="mb-8 flex items-center justify-between">
            <Link
              to="/"
              className="text-xl font-bold text-yellow-500 transition-colors duration-150 hover:text-yellow-400"
              onClick={closeMobile}
            >
              AeroQuiz
            </Link>

            <button
              onClick={closeMobile}
              aria-label="Close menu"
              className="rounded-md p-2 text-indigo-600 transition-colors duration-150 hover:bg-indigo-600/10"
            >
              <XMarkIcon className="size-6" />
            </button>
          </div>

          {/* Mobile nav links — stacked vertically */}
          <div className="flex flex-col gap-3">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={closeMobile}
                className={linkClass + ' py-3 text-center text-base'}
              >
                {label}
              </Link>
            ))}
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
