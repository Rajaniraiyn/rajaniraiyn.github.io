import tailwindcss from '@tailwindcss/vite';
import reactRouter from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { ViteWebfontDownload } from 'vite-plugin-webfont-dl';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    dedupe: ['react', 'react-dom'],
  },
  plugins: [
    reactRouter(),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
    ViteWebfontDownload([
      'https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&display=swap'
    ])
  ],
})
