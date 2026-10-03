import path from 'node:path'
import { ESLint } from 'eslint'
import { expect, test } from 'vitest'
const root = path.resolve(import.meta.dirname, '../..')
const eslint = new ESLint({ cwd: root, overrideConfigFile: path.join(root, 'eslint.config.mjs') })
async function messages(code, relativeFile) {
  const [result] = await eslint.lintText(code, { filePath: path.join(root, relativeFile) })
  return result?.messages.map((message) => message.ruleId) ?? []
}
test('accepts web imports from contracts', async () => {
  expect(
    await messages(
      "import type { HealthResponse } from '@workspace/contracts'",
      'apps/web/src/valid.ts',
    ),
  ).toEqual([])
})
test('rejects package, relative re-export, and dynamic web imports from API', async () => {
  expect(
    await messages(
      "import '@workspace/api/server'\nexport * from '../../api/src/server.js'\nimport('../../api/src/server.js')",
      'apps/web/src/invalid.ts',
    ),
  ).toEqual(['project/workspace-imports', 'project/workspace-imports', 'project/workspace-imports'])
})
test('rejects runtime imports from contracts', async () => {
  expect(
    await messages("import { createServer } from 'node:http'", 'packages/contracts/src/invalid.ts'),
  ).toEqual(['project/workspace-imports'])
})
