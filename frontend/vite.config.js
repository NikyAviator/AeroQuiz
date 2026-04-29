import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // Vite forwards requests to the GO backend API
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
