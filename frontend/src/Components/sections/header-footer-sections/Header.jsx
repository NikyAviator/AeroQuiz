import { useCallback, useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import useDarkMode from '../../hooks/useDarkMode.jsx';
import { useAuth } from '../../hooks/useAuth.jsx';

// ── Styles ────────────────────────────────────────────────────────────────────
const linkClass =
  'bg-gray-900 px-4 py-2 text-sm font-semibold text-yellow-400 hover:bg-gray-800 hover:text-yellow-300 transition-colors duration-150 dark:bg-gray-800 dark:hover:bg-gray-700';

const logoutClass =
  'bg-gray-900 px-4 py-2 text-sm font-semibold text-yellow-400 hover:bg-gray-800 hover:text-yellow-300 transition-colors duration-150 dark:bg-gray-800 dark:hover:bg-gray-700';

// ── NavItems — defined at MODULE SCOPE, not inside Header ────────────────────
// This is critical: if NavItems were defined inside Header, React would see it
// as a brand new component type on every render, causing unnecessary unmounts
// and state resets. At module scope it is created once and stays stable.
// All values it needs come in as props from Header.
function NavItems({ mobile, loading, user, closeMobile, onLogout }) {
  // While /me is resolving on startup, render nothing to prevent
  // the nav from flashing "Sign In" before it knows the user is logged in.
  if (loading) return null;

  const base = mobile ? linkClass + ' py-3 text-center text-base' : linkClass;
  const baseLogout = mobile
    ? logoutClass + ' py-3 text-center text-base'
    : logoutClass;

  if (user) {
    // ── Logged in ────────────────────────────────────────────────────────────
    return (
      <>
        <Link to="/" onClick={closeMobile} className={base}>
          Home
        </Link>
        <Link to="/dashboard" onClick={closeMobile} className={base}>
          Dashboard
        </Link>
        {/* Greeting — not a link, just a friendly label */}
        <span className="px-3 py-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200">
          Welcome, {user.username}!
        </span>
        <button onClick={onLogout} className={baseLogout}>
          Logout
        </button>
      </>
    );
  }

  // ── Not logged in ──────────────────────────────────────────────────────────
  return (
    <>
      <Link to="/" onClick={closeMobile} className={base}>
        Home
      </Link>
      <Link to="/signin" onClick={closeMobile} className={base}>
        Sign In
      </Link>
      <Link to="/register" onClick={closeMobile} className={base}>
        Register
      </Link>
    </>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────
export default function Header() {
  const [dark, setDark] = useDarkMode();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user, loading, clearUser } = useAuth();
  const navigate = useNavigate();

  const toggleTheme = useCallback(() => setDark((d) => !d), [setDark]);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // ── Logout ─────────────────────────────────────────────────────────────────
  // 1. Call backend to clear the httpOnly cookie
  // 2. Clear user from AuthContext — Header re-renders to show Sign In
  // 3. Redirect to homepage
  // finally block ensures steps 2+3 always run even if the network fails
  const handleLogout = useCallback(async () => {
    try {
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      clearUser();
      closeMobile();
      navigate('/');
    }
  }, [clearUser, closeMobile, navigate]);

  return (
    <header className="border-b border-indigo-100 bg-indigo-50 dark:border-gray-800 dark:bg-gray-950">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8"
      >
        {/* ── 1. Brand ── */}
        <Link
          to="/"
          className="-m-1.5 flex items-center gap-2 p-1.5 text-xl font-bold text-yellow-500 transition-colors duration-150 hover:text-yellow-400"
          onClick={closeMobile}
        >
          AeroQuiz
          <PaperAirplaneIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </Link>

        {/* ── 2. Desktop nav ── */}
        <div className="hidden items-center gap-3 lg:flex">
          <NavItems
            mobile={false}
            loading={loading}
            user={user}
            closeMobile={closeMobile}
            onLogout={handleLogout}
          />
        </div>

        {/* ── 3. Right side controls ── */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-md p-2 text-indigo-600 ring-1 ring-indigo-600/30 transition-colors duration-150 hover:bg-indigo-600/10 dark:text-indigo-400 dark:ring-indigo-400/30 dark:hover:bg-indigo-400/10"
          >
            {dark ? (
              <SunIcon className="size-5" />
            ) : (
              <MoonIcon className="size-5" />
            )}
          </button>

          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="rounded-md p-2 text-indigo-600 transition-colors duration-150 hover:bg-indigo-600/10 dark:text-indigo-400 lg:hidden"
          >
            <Bars3Icon className="size-6" />
          </button>
        </div>
      </nav>

      {/* ── Mobile dialog ── */}
      <Dialog open={mobileOpen} onClose={closeMobile} className="lg:hidden">
        <div className="fixed inset-0 z-10 bg-black/40" />
        <DialogPanel className="fixed inset-y-0 right-0 z-20 w-full max-w-sm overflow-y-auto bg-indigo-50 px-6 py-6 dark:bg-gray-950 sm:ring-1 sm:ring-indigo-100 dark:sm:ring-gray-800">
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
              className="rounded-md p-2 text-indigo-600 transition-colors duration-150 hover:bg-indigo-600/10 dark:text-indigo-400"
            >
              <XMarkIcon className="size-6" />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <NavItems
              mobile={true}
              loading={loading}
              user={user}
              closeMobile={closeMobile}
              onLogout={handleLogout}
            />
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
