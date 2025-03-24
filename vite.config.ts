import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/', // ✅ esto es clave para que Render sirva correctamente las rutas
  plugins: [
    react(),
    tailwindcss(),
  ],
});
