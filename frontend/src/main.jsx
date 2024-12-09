import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './scss/styles.scss';
import WrappedApp from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WrappedApp />
  </StrictMode>
);
