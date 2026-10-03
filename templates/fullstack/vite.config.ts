import { defineConfig } from 'vite-plus'
import { sharedFormat, sharedLint } from './tooling/vite-shared.js'
export default defineConfig({
  lint: { ...sharedLint, plugins: [...sharedLint.plugins, 'vue'] },
  fmt: sharedFormat,
  test: {
    include: ['apps/api/**/*.test.ts', 'packages/**/*.test.ts', 'tooling/**/*.test.mjs'],
    environment: 'node',
  },
})
