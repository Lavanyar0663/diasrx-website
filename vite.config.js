import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      include: /\.(jsx|js)$/,
    })
  ],
  server: {
    host: "0.0.0.0",
    port: 8074,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://180.235.121.253:8167',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
})
