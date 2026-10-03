import { defineConfig } from 'vite-plus'
import { sharedFormat, sharedLint } from './tooling/vite-shared.js'
export default defineConfig({
  lint: sharedLint,
  fmt: sharedFormat,
  test: {
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts', 'tooling/**/*.test.mjs'],
    environment: 'node',
  },
})
