import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Use '/' for Vercel, '/Oposiciones-App/' for GitHub Pages
  base: process.env.VERCEL ? '/' : '/Oposiciones-App/',
})
