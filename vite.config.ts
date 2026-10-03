import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite-plus'
import { playwright } from 'vite-plus/test/browser-playwright'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: { '@': new URL('./src', import.meta.url).pathname },
  },
  run: {
    cache: { tasks: false },
    tasks: {
      'check:lint': {
        command: 'vp lint --deny-warnings . && eslint --max-warnings 0 .',
      },
      'check:format': { command: 'vp fmt --check .' },
      'check:types': { command: 'vue-tsc -b' },
      'check:documentation': { command: 'node tooling/check-docs.mjs' },
      'check:all': {
        command: 'echo "Checks passed"',
        dependsOn: ['check:lint', 'check:format', 'check:types', 'check:documentation'],
      },
      'verify:rules': { command: 'pnpm test:rules', dependsOn: ['check:all'] },
      'verify:unit': { command: 'pnpm test:unit', dependsOn: ['check:all'] },
      'verify:browser': {
        command: 'pnpm test:browser',
        dependsOn: ['check:all'],
      },
      'verify:build': { command: 'vp build', dependsOn: ['check:all'] },
      'verify:e2e': { command: 'playwright test', dependsOn: ['verify:build'] },
      'verify:all': {
        command: 'echo "Verification passed"',
        dependsOn: ['verify:rules', 'verify:unit', 'verify:browser', 'verify:e2e'],
      },
    },
  },
  lint: {
    jsPlugins: [
      {
        name: 'anti-slop',
        specifier: './tooling/oxlint/anti-slop/index.ts',
      },
    ],
    options: { typeAware: true, typeCheck: true },
    plugins: ['typescript', 'oxc', 'vue', 'vitest'],
    categories: { correctness: 'error', suspicious: 'warn', perf: 'warn' },
    ignorePatterns: [
      'dist/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      'tooling/fixtures/**',
      'tooling/oxlint/anti-slop/**',
    ],
    overrides: [
      {
        files: ['tooling/eslint/feature-boundaries.mjs'],
        rules: { complexity: 'off' },
      },
    ],
    rules: {
      complexity: ['error', { max: 10 }],
      'no-nested-ternary': 'error',
      'typescript/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
      'typescript/consistent-type-imports': 'error',
      'typescript/no-explicit-any': 'error',
      'typescript/no-floating-promises': 'error',
      'typescript/no-misused-promises': 'error',
      'anti-slop/no-chained-type-assertions': 'error',
      'anti-slop/no-conditional-empty-object-spread': 'error',
      'anti-slop/no-known-value-widening': 'error',
      'anti-slop/no-reduce-accumulator-copy': 'error',
      'anti-slop/no-widen-then-assert': 'error',
    },
  },
  fmt: { singleQuote: true, semi: false, sortPackageJson: true },
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
