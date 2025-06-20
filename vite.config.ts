import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  base: '/',   // important for routing on Vercel
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173,
  }
})
