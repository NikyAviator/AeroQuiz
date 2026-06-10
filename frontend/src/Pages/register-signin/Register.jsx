import { useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

// ── Password strength logic ──────────────────────────────────────────────────
function getStrength(password) {
  if (password.length === 0) return null;
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 2) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/3' };
  if (score <= 3)
    return { label: 'Medium', color: 'bg-yellow-400', width: 'w-2/3' };
  return { label: 'Strong', color: 'bg-green-500', width: 'w-full' };
}

// ── Email validation ─────────────────────────────────────────────────────────
// Checks that the email looks like: something@something.something
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const MAX_PASSWORD_LENGTH = 25;

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Track whether each password field is visible
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState('');

  // ── Derived validation state ─────────────────────────────────────────────
  const emailTouched = form.email.length > 0;
  const emailValid = isValidEmail(form.email);
  const emailInvalid = emailTouched && !emailValid;

  const strength = getStrength(form.password);
  const passwordsMatch =
    form.confirmPassword.length > 0 && form.password === form.confirmPassword;
  const passwordsMismatch =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  const canSubmit =
    form.username.trim() !== '' &&
    emailValid &&
    form.password.length >= 8 &&
    form.password.length <= MAX_PASSWORD_LENGTH &&
    passwordsMatch;

  function handleChange(e) {
    setError('');
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    // TODO: wire to backend POST /api/v1/auth/register
    console.log('Submitting:', {
      username: form.username,
      email: form.email,
      password: form.password,
    });
  }

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <PaperAirplaneIcon className="mx-auto h-10 w-10 text-indigo-600 dark:text-indigo-400" />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
            Create your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ── Username ── */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="e.g. CaptainNiky"
                  value={form.username}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            {/* ── Email ── */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-500 sm:text-sm/6 ${
                    emailInvalid
                      ? 'outline-red-400 focus:outline-red-500 dark:outline-red-400'
                      : emailTouched && emailValid
                        ? 'outline-green-400 focus:outline-green-500 dark:outline-green-400'
                        : 'outline-gray-300 focus:outline-indigo-600 dark:outline-white/10 dark:focus:outline-indigo-500'
                  }`}
                />
              </div>
              {emailInvalid && (
                <p className="mt-1 text-xs text-red-500">
                  Please enter a valid email address.
                </p>
              )}
            </div>

            {/* ── Password ── */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
              >
                Password
              </label>
              <div className="relative mt-2">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  maxLength={MAX_PASSWORD_LENGTH}
                  value={form.password}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 pr-10 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500 sm:text-sm/6"
                />
                {/* Eye toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Strength bar + counter */}
              {form.password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-white/10">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${strength.color} ${strength.width}`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`font-medium ${
                        strength.label === 'Weak'
                          ? 'text-red-500'
                          : strength.label === 'Medium'
                            ? 'text-yellow-500'
                            : 'text-green-500'
                      }`}
                    >
                      {strength.label}
                    </span>
                    <span className="text-gray-400 dark:text-gray-500">
                      {form.password.length} / {MAX_PASSWORD_LENGTH}
                    </span>
                  </div>
                  {form.password.length < 8 && (
                    <p className="text-xs text-red-500">
                      Minimum 8 characters required.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* ── Confirm Password ── */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
              >
                Confirm password
              </label>
              <div className="relative mt-2">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  maxLength={MAX_PASSWORD_LENGTH}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full rounded-md bg-white px-3 py-1.5 pr-10 text-base text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-500 sm:text-sm/6 ${
                    passwordsMismatch
                      ? 'outline-red-400 focus:outline-red-500 dark:outline-red-400'
                      : passwordsMatch
                        ? 'outline-green-400 focus:outline-green-500 dark:outline-green-400'
                        : 'outline-gray-300 focus:outline-indigo-600 dark:outline-white/10 dark:focus:outline-indigo-500'
                  }`}
                />
                {/* Eye toggle */}
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirm ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {passwordsMismatch && (
                <p className="mt-1 text-xs text-red-500">
                  Passwords do not match.
                </p>
              )}
              {passwordsMatch && (
                <p className="mt-1 text-xs text-green-500">Passwords match ✓</p>
              )}
            </div>

            {/* ── Global error ── */}
            {error && (
              <p className="text-center text-sm text-red-500">{error}</p>
            )}

            {/* ── Submit ── */}
            <div>
              <button
                type="submit"
                disabled={!canSubmit}
                className="shadow-xs flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                Create account
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <a
              href="/signin"
              className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
