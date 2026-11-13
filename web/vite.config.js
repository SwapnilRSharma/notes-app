import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  root: 'web',
  plugins: [react()],
  server: {
    port: 5180,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5174', // Express server
        changeOrigin: true,
      },
    },
  },
  build: {
    // Output inside the web/ root so Express can serve web/dist in production
    // Previously this was 'web/dist' which resulted in web/web/dist and broke prod serving
    outDir: 'dist',
  },
})
