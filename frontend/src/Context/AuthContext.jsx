import { createContext } from 'react';

// The context object — exported so AuthProvider and useAuth can both import it.
// Kept in its own file to satisfy the eslint react-refresh rule which requires
// files to only export React components OR non-component values, not both.
export const AuthContext = createContext(null);
