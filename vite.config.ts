import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: '0.0.0.0',
    port: 12000,
    proxy: {
      '/dodo-api': {
        target: 'https://api.dodopayments.com/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dodo-api/, ''),
        secure: true,
        headers: {
          'User-Agent': 'Granada-App/1.0'
        }
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'lucide-react'],
        }
      }
    }
  }
});