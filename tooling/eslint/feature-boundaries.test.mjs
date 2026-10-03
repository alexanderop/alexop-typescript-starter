import { expect, test } from 'vitest'
import { Linter } from 'eslint'
import path from 'node:path'
import { architectureRule } from './feature-boundaries.mjs'

function messages(code, filename) {
  return new Linter()
    .verify(
      code,
      [
        {
          files: ['**/*.js'],
          plugins: { project: { rules: { architecture: architectureRule } } },
          rules: { 'project/architecture': 'error' },
        },
      ],
      { filename: path.resolve(filename) },
    )
    .map((message) => message.messageId)
}

test('rejects sibling feature imports including dynamic imports and re-exports', () => {
  for (const code of [
    "import { value } from '../other/domain.js';",
    "export { value } from '../other/domain.js';",
    "const feature = import('../other/domain.js');",
  ])
    expect(messages(code, 'src/features/reading-list/domain.js')).toEqual(['sibling'])
})

test('rejects upward dependencies', () => {
  expect(messages("import '../features/reading-list/domain.js';", 'src/shared/value.js')).toEqual([
    'upward',
  ])
  expect(messages("import '../../app/main.js';", 'src/features/reading-list/domain.js')).toEqual([
    'upward',
  ])
})

test('allows app composition, within-feature imports, and shared dependencies', () => {
  expect(messages("import '../features/reading-list';", 'src/app/main.js')).toEqual([])
  expect(messages("import './domain.js';", 'src/features/reading-list/list.js')).toEqual([])
  expect(
    messages("import '../../shared/format.js';", 'src/features/reading-list/domain.js'),
  ).toEqual([])
})

test('allows application composition to import only feature entry points', () => {
  for (const code of [
    "import '../features/reading-list';",
    "import '../features/reading-list/index.js';",
    "import '@/features/reading-list';",
  ])
    expect(messages(code, 'src/app/main.js')).toEqual([])

  for (const code of [
    "import '../features/reading-list/ReadingList.vue';",
    "export { value } from '@/features/reading-list/domain.js';",
    "import('../features/reading-list/internal.js');",
  ])
    expect(messages(code, 'src/app/main.js')).toEqual(['privateEntry'])
})

test('rejects sibling feature globs, directory imports, and Vite root imports', () => {
  for (const code of [
    "import.meta.glob('../other/*.ts');",
    "import.meta.glob(['./*.ts', '../other/*.ts']);",
    "import '../other';",
    "import '/src/features/other/domain.js';",
  ])
    expect(messages(code, 'src/features/reading-list/domain.js')).toEqual(['sibling'])
})

test('checks aliases and static template imports', () => {
  for (const code of [
    "import '@/features/other/domain.js';",
    "export * from '@/features/other/domain.js';",
    'import(`../other/domain.js`);',
  ])
    expect(messages(code, 'src/features/reading-list/domain.js')).toEqual(['sibling'])
  expect(messages("import '@/app/main.js';", 'src/shared/value.js')).toEqual(['upward'])
  expect(messages("import '@/features/reading-list/index.js';", 'src/app/main.js')).toEqual([])
})

test('rejects computed import paths that cannot be checked', () => {
  expect(
    messages('import(`../${name}/domain.js`);', 'src/features/reading-list/domain.js'),
  ).toEqual(['dynamic'])
  expect(messages('import(target);', 'src/shared/value.js')).toEqual(['dynamic'])
})

test('rejects broad globs in arrays and computed glob calls', () => {
  for (const code of [
    "import.meta.glob('../../**/*.ts');",
    "import.meta.glob(['./*.ts', '../../**/*.ts']);",
    "import.meta['glob']('../../**/*.ts');",
    "import.meta.glob('@/features/*/domain.ts');",
    "import.meta.glob('../reading-list*/domain.ts');",
  ])
    expect(messages(code, 'src/features/reading-list/domain.js')).toEqual(['broadGlob'])
})

test('allows globs confined to the feature and shared directories', () => {
  expect(messages("import.meta.glob('./**/*.ts');", 'src/features/reading-list/domain.js')).toEqual(
    [],
  )
  expect(
    messages("import.meta.glob('@/shared/**/*.ts');", 'src/features/reading-list/domain.js'),
  ).toEqual([])
  expect(
    messages("import.meta.glob('./fixtures/*.ts');", 'src/features/reading-list/domain.js'),
  ).toEqual([])
  expect(
    messages(
      "import.meta.glob('@/shared/formatters/*.ts');",
      'src/features/reading-list/domain.js',
    ),
  ).toEqual([])
  expect(messages("import.meta.glob('../features/**/*.ts');", 'src/app/main.js')).toEqual([])
})
