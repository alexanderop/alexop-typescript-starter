import vue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import { workspaceImports } from './tooling/eslint/workspace-imports.mjs'
export default [
  { ignores: ['**/dist/**', 'node_modules/**', 'tooling/oxlint/**'] },
  ...vue.configs['flat/essential'],
  {
    files: ['apps/web/**/*.{ts,vue}', 'packages/contracts/**/*.ts'],
    languageOptions: {
      parserOptions: { parser: tseslint.parser, ecmaVersion: 'latest', sourceType: 'module' },
    },
    plugins: { project: { rules: { 'workspace-imports': workspaceImports } } },
    rules: {
      'project/workspace-imports': 'error',
      'vue/no-v-html': 'error',
      'vue/no-mutating-props': 'error',
      'vue/require-explicit-emits': 'error',
    },
  },
  { files: ['**/*.ts'], languageOptions: { parser: tseslint.parser } },
]
