import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api/auth': {
        target: process.env.VITE_AUTH_URL || 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/auth/, '')
      },
      '/api/bid': {
        target: process.env.VITE_BID_URL || 'http://localhost:3002',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/bid/, '')
      },
      '/api/doc': {
        target: process.env.VITE_DOC_URL || 'http://localhost:3003',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/doc/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          axios: ['axios']
        }
      }
    }
  },
  preview: {
    port: 3000
  },
  define: {
    'process.env': {}
  }
})