import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite-plus'
import { playwright } from 'vite-plus/test/browser-playwright'
import { sharedFormat, sharedLint } from './tooling/vite-shared.js'
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: { alias: { '@': new URL('./src', import.meta.url).pathname } },
  lint: { ...sharedLint, plugins: [...sharedLint.plugins, 'vue'] },
  fmt: sharedFormat,
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['tooling/**/*.test.mjs', 'src/**/*.test.ts'],
          exclude: ['tests/browser/**'],
          environment: 'node',
        },
      },
      {
        extends: true,
        test: {
          name: 'browser',
          include: ['tests/browser/**/*.test.ts'],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
