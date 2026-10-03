import { defineConfig } from 'vite-plus'
import { createSharedLint, sharedFormat } from './templates/base/tooling/vite-shared.js'

export default defineConfig({
  lint: createSharedLint('./templates/base/tooling/oxlint/anti-slop/index.ts'),
  fmt: sharedFormat,
  test: { include: ['tests/**/*.test.mjs'], environment: 'node' },
})
