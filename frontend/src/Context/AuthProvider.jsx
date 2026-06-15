import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

// The Provider
// Wraps the entire app (in main.jsx) and holds the actual auth state.
// Any component inside the provider can access user state via useAuth().
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = not logged in
  const [loading, setLoading] = useState(true); // true while /me is being called

  // On every app startup (including page refresh), call /me to check
  // if the browser still has a valid auth_token cookie.
  // If yes → restore the user into state (stays "logged in").
  // If no  → keep user as null (not logged in).
  // This is the only way React can know about the httpOnly cookie.
  useEffect(() => {
    async function restoreSession() {
      try {
        const res = await fetch('/api/v1/me', {
          method: 'GET',
          // credentials: 'include' tells fetch to send cookies automatically.
          // Without this, the browser would not send the auth_token cookie.
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data); // restore user from the valid cookie
        } else {
          setUser(null); // cookie missing or expired — not logged in
        }
      } catch {
        // Network error or server down — treat as not logged in
        setUser(null);
      } finally {
        // Always stop loading — whether we found a user or not.
        // This unblocks the Header and other components from rendering.
        setLoading(false);
      }
    }

    restoreSession();
  }, []); // empty array = runs once on mount, never again

  function clearUser() {
    setUser(null);
  }

  const value = {
    user, // the logged-in UserPublic object, or null
    loading, // true while /me is in flight — use this to avoid flashes
    setUser, // called after successful login or register
    clearUser, // called after successful logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
