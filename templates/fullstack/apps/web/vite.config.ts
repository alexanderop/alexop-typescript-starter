import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite-plus'
const apiProxy = {
  target: 'http://127.0.0.1:4310',
  rewrite: (path: string) => path.replace(/^\/api/, ''),
}
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: { outDir: 'dist' },
  server: { proxy: { '/api': apiProxy } },
  preview: { proxy: { '/api': apiProxy } },
})
