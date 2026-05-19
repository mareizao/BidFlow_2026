import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    allowedHosts: [
      'bidflow-2026-cx0b.onrender.com',
      'bidflow-frontend.onrender.com',
      '.onrender.com' // Permite todos los subdominios de render
    ]
  },
  preview: {
    port: 3000,
    host: true,
    allowedHosts: [
      'bidflow-2026-cx0b.onrender.com',
      'bidflow-frontend.onrender.com',
      '.onrender.com'
    ]
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          axios: ['axios']
        }
      }
    }
  }
})