import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id, { getModuleInfo }) {
          const allModules = getModuleInfo()
          return {
            chunks: allModules.reduce((prev, module) => {
              const name = module.name.replace(/index\.js$/, '').replace(/\.\w+$/, '-')
              prev[name] = module
              return prev
            }, {})
          }
        },
      },
    },
  },
})