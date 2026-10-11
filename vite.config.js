import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/my-portfolio/', // Important for GitHub Pages
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-framework': ['react', 'react-dom'],
          'vendor-animation': ['framer-motion'],
          'vendor-icons': ['react-icons'],
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
})
