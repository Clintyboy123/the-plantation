import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // "/" for the VPS. The GitHub Pages preview builds with VITE_BASE=/the-plantation/ (see .github/workflows/pages.yml).
  base: process.env.VITE_BASE || '/',
  plugins: [react(), tailwindcss()],
  server: {
    // Local development only: stands in for the Nginx /api proxy used in production.
    proxy: {
      '/api': {
        target: process.env.DEV_API_TARGET || 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
    },
  },
});
