import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    plugins: [react({
      jsxRuntime: 'automatic',
    }),
    tailwindcss(),
  ],
    root: resolve(__dirname),
    base: './',
    build: {
      outDir: resolve(__dirname, '../../dist/renderer'),
      //outDir: resolve(__dirname, './index.html'),

      emptyOutDir: true,
      rollupOptions: {
        external: [],
      }
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
    // Development server configuration
    server: {
      port: 3000,
      strictPort: true,
    },
    // Add source maps for better debugging
    esbuild: {
      sourcemap: isDev,
    },
    define: {
      // Expose development mode to your React app
      __IS_DEV__: isDev,
    }
  }
})