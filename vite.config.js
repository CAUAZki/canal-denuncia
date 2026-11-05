import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Host allowlist: the sandbox preview reaches the dev server through a rotating
// sandbox hostname. Extend Vite's list only while running in the Base44 preview.
const allowedHosts = ['localhost', '127.0.0.1'];
if (process.env.BASE44_PREVIEW_MODE === '1' && process.env.BASE44_SANDBOX_HOST_DOMAIN) {
  allowedHosts.push(`.${process.env.BASE44_SANDBOX_HOST_DOMAIN}`);
}

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts,
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET || 'http://localhost:8000',
        changeOrigin: false,
      },
    },
    watch: {
      usePolling: true,
      interval: 300,
    },
  },
});
