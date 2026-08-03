import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  define: {
    // sockjs-client espera la variable global 'global' (típica de Node.js);
    // el navegador no la tiene, asi que la mapeamos a 'window'.
    global: 'window',
  },
})
