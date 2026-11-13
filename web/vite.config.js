import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite dev server with proxy to our Express API to avoid CORS in dev
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
