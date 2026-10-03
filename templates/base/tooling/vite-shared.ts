export function createSharedLint(pluginSpecifier = './tooling/oxlint/anti-slop/index.ts') {
  return {
    jsPlugins: [{ name: 'anti-slop', specifier: pluginSpecifier }],
    options: { typeAware: true, typeCheck: true },
    plugins: ['typescript', 'oxc', 'vitest'],
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
        files: [
          'tooling/check-docs.mjs',
          'tooling/eslint/feature-boundaries.mjs',
          'tooling/eslint/workspace-imports.mjs',
        ],
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
  } satisfies NonNullable<UserConfig['lint']>
}

export const sharedLint = createSharedLint()

export const sharedFormat = {
  singleQuote: true,
  semi: false,
  sortPackageJson: true,
} satisfies NonNullable<UserConfig['fmt']>
import type { UserConfig } from 'vite-plus'
