import { defineConfig } from 'vite';

export default defineConfig({
  base: '/taubenspiel',
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
