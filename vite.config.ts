import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { handleTtsRequest } from './server/server.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'tts-api-proxy',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.startsWith('/api/tts')) {
            handleTtsRequest(req, res);
          } else {
            next();
          }
        });
      }
    }
  ],
  server: {
    port: 5173,
    host: true,
    proxy: {
      // Fallback if standalone server is running on 3001
      '/api/tts-external': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/tts-external/, '/api/tts')
      }
    }
  }
})
