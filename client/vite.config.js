import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    target: 'esnext'
  },
  esbuild: {
    jsx: 'automatic'
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://academic-ballot-backend.vercel.app',
        changeOrigin: true
      }
    }
  }
})