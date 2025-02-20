import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Asegura que las rutas sean relativas para producción
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
