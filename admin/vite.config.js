import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const backendTarget = process.env.VITE_BACKEND_URL || (process.env.USE_LOCAL_BACKEND === 'true' ? 'http://localhost:5000' : 'https://easyxerox.com');

export default defineConfig({
  base: '/admin/',
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    host: true,
    proxy: {
      '/api': {
        target: backendTarget,
        changeOrigin: true,
        secure: false
      },
      '/uploads': {
        target: backendTarget,
        changeOrigin: true,
        secure: false
      },
      '/socket.io': {
        target: backendTarget,
        ws: true,
        changeOrigin: true,
        secure: false
      }
    }
  }
});
