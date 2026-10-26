import { copyFileSync, existsSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, Plugin } from 'vite'
import svgr from 'vite-plugin-svgr'

const ensureRuntimeConfigPlugin = (): Plugin => ({
  name: 'ensure-runtime-config',
  configResolved(config) {
    const configPath = resolve(config.root, 'public/config.json')
    const examplePath = resolve(config.root, 'public/config.example.json')

    if (!existsSync(configPath)) {
      if (existsSync(examplePath)) {
        copyFileSync(examplePath, configPath)
      } else {
        writeFileSync(
          configPath,
          `${JSON.stringify({ allowedApiOrigins: [], allowedApiPatterns: [] }, null, 2)}\n`,
          'utf-8',
        )
      }
    }
  },
})

// https://vitejs.dev/config/
export default defineConfig({
  base:
    process.env.VITE_IS_GH_PAGES === 'true' ? '/generic-map-with-pois/' : '/',
  plugins: [
    ensureRuntimeConfigPlugin(),
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
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('leaflet')) return 'vendor-leaflet'
            if (id.includes('react')) return 'vendor-react'
            if (id.includes('zod')) return 'vendor'
            if (id.includes('html2pdf.js')) return 'vendor-html2pdf'
          }
        },
      },
    },
  },
})
