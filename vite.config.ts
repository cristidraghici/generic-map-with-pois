import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  base:
    process.env.VITE_IS_GH_PAGES === 'true' ? '/generic-map-with-pois/' : '/',
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        exportType: 'named',
        ref: true,
        svgo: true,
        titleProp: true,
      },
      include: '**/*.svg',
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('leaflet')) return 'vendor-leaflet'
            if (id.includes('react')) return 'vendor-react'
            if (id.includes('html2pdf.js')) return 'vendor-html2pdf'
            return 'vendor'
          }
        },
      },
    },
  },
})
