import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App.jsx';
import { AuthProvider } from './Context/AuthProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* AuthProvider wraps the entire app so every component can access
        the logged-in user via useAuth() without prop drilling */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
