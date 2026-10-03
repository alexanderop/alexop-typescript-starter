import path from 'node:path'
import { existsSync } from 'node:fs'
import { ESLint } from 'eslint'
import { expect, test } from 'vitest'

const root = path.resolve(import.meta.dirname, '../..')
const sourceRoot = existsSync(path.join(root, 'apps/web')) ? 'apps/web/src' : 'src'
const eslint = new ESLint({ cwd: root, overrideConfigFile: path.join(root, 'eslint.config.mjs') })

async function rules(code, name = 'SearchPanel.vue') {
  const [result] = await eslint.lintText(code, { filePath: path.join(root, sourceRoot, name) })
  return result?.messages.map((message) => message.ruleId) ?? []
}

test('accepts PascalCase components with kebab-case props and directive shorthands', async () => {
  expect(
    await rules(`<script setup lang="ts">
import SearchButtonRun from './SearchButtonRun.vue'
defineProps<{ isLoading: boolean }>()
const runSearch = () => undefined
</script>
<template>
  <SearchButtonRun
    :is-loading="isLoading"
    @click="runSearch"
  />
</template>`),
  ).toEqual([])
})

test('rejects filename casing and component import aliases that hide the file name', async () => {
  expect(await rules('<template><p>Search</p></template>', 'search-panel.vue')).toContain(
    'component-style/filename',
  )
  expect(
    await rules(`<script setup lang="ts">
import searchButton from './SearchButtonRun.vue'
</script>
<template><searchButton /></template>`),
  ).toContain('component-style/import-name')
})

test('rejects component casing, expanded directives, camelCase attributes and paired empty tags', async () => {
  const messages = await rules(`<script setup lang="ts">
import SearchButtonRun from './SearchButtonRun.vue'
defineProps<{ isLoading: boolean }>()
</script>
<template><search-button-run v-bind:isLoading="isLoading"></search-button-run></template>`)
  expect(messages).toEqual(
    expect.arrayContaining([
      'vue/component-name-in-template-casing',
      'vue/attribute-hyphenation',
      'vue/v-bind-style',
      'vue/html-self-closing',
    ]),
  )
})

test('rejects several attributes on one line', async () => {
  expect(await rules('<template><input type="text" aria-label="Search" /></template>')).toContain(
    'vue/max-attributes-per-line',
  )
})
