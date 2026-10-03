import { mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, expect, test } from 'vitest'
import { checkDocumentation } from './check-docs.mjs'

const roots = []
afterEach(() => roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true })))
function fixture(readme) {
  const root = mkdtempSync(path.join(tmpdir(), 'docs-check-'))
  roots.push(root)
  writeFileSync(path.join(root, 'package.json'), JSON.stringify({ scripts: { check: 'true' } }))
  writeFileSync(path.join(root, 'README.md'), readme)
  mkdirSync(path.join(root, 'docs'))
  writeFileSync(path.join(root, 'docs', 'guide.md'), '# Guide\n')
  return root
}
test('accepts existing links and documented scripts', () => {
  expect(checkDocumentation(fixture('[Guide](./docs/guide.md)\n\n`pnpm check`\n'))).toBe(2)
})
test('rejects a broken local link', () => {
  expect(() => checkDocumentation(fixture('[Missing](./docs/missing.md)'))).toThrow(
    'links to missing',
  )
})
test('rejects a command absent from package scripts', () => {
  expect(() => checkDocumentation(fixture('Run `pnpm verify`.'))).toThrow(
    'missing pnpm script verify',
  )
})
test('the command-line checker executes and rejects a broken link', () => {
  const root = fixture('[Missing](./docs/missing.md)')
  const alias = path.join(root, 'checker alias.mjs')
  symlinkSync(fileURLToPath(new URL('./check-docs.mjs', import.meta.url)), alias)
  const result = spawnSync(process.execPath, [alias, root], { encoding: 'utf8' })
  expect(result.status).toBe(1)
  expect(result.stderr).toContain('links to missing')
})
