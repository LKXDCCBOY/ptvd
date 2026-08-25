import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: './',
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg'],
  },
  server: {
    port: 5173,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    proxy: {
      '/ffmpeg-cdn': {
        target: 'https://cdn.jsdelivr.net',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/ffmpeg-cdn/, ''),
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            if (proxyRes.url?.endsWith('.js')) {
              proxyRes.headers['content-type'] = 'application/javascript'
            }
            if (proxyRes.url?.endsWith('.wasm')) {
              proxyRes.headers['content-type'] = 'application/wasm'
            }
          })
        },
      },
    },
  },
  preview: {
    port: 4173,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
})
