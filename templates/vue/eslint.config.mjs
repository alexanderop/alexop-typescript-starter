import vue from 'eslint-plugin-vue'
import { vueStyle } from './tooling/eslint/vue-style.mjs'
import tseslint from 'typescript-eslint'

import { architectureRule } from './tooling/eslint/feature-boundaries.mjs'

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      'tooling/fixtures/**',
      'tooling/oxlint/anti-slop/**',
    ],
  },
  ...vue.configs['flat/essential'],
  {
    files: ['src/**/*.{ts,vue}'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      project: { rules: { 'feature-boundaries': architectureRule } },
    },
    rules: {
      'project/feature-boundaries': 'error',
      'vue/no-v-html': 'error',
      'vue/no-mutating-props': 'error',
      'vue/no-ref-as-operand': 'error',
      'vue/require-explicit-emits': 'error',
    },
  },
  { files: ['**/*.ts'], languageOptions: { parser: tseslint.parser } },
  ...vueStyle,
]
