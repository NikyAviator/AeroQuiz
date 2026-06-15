import { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';

// The consumer hook
// Any component calls useAuth() to access the context value.
// The error guard ensures useAuth() is never called outside AuthProvider,
// which would give confusing undefined errors without a clear message.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
