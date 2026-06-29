import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

// ProtectedRoute — wraps any route that requires authentication.
//
// Three states:
//   loading → render nothing while /me resolves on startup (prevents
//             incorrectly redirecting a logged-in user on page refresh)
//   no user → redirect to /signin
//   user    → render children normally
//
// Usage in App.jsx:
//   <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//
// Future extensions:
//   PaidRoute    → same pattern but checks user.isSubscribed
//   AdminRoute   → same pattern but checks user.isAdmin

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Still waiting for /me to come back — render nothing to avoid flash
  if (loading) return null;

  // Not logged in — redirect to sign in, preserving the intended path
  // so after login the user can be sent back to where they were going
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Logged in — render the protected page
  return children;
}
