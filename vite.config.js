import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          'ui-components': ['lucide-react', 'react-beautiful-dnd', 'react-draggable', 'react-resizable'],
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
