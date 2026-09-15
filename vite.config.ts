import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'
// @ts-ignore
import wasmPlugin from 'vite-plugin-wasm'

const wasm = (wasmPlugin as any).default || wasmPlugin;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    wasm()
  ],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2022'
    }
  },
  build: {
    target: 'es2022'
  }
})
