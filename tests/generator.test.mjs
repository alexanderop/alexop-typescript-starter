import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, expect, test } from 'vitest'
import { createProject, templateIds, validateRequest } from '../src/templates.mjs'

/** @type {string[]} */
const roots = []
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { force: true, recursive: true })
})
function temporaryRoot() {
  const root = mkdtempSync(path.join(tmpdir(), 'typescript-kit-test-'))
  roots.push(root)
  return root
}
test.each(templateIds)('creates a standalone %s project from base and overlay', (template) => {
  const destination = path.join(temporaryRoot(), 'project')
  createProject({ destination, template, name: 'example-project' })
  expect(readFileSync(path.join(destination, 'package.json'), 'utf8')).toContain('example-project')
  expect(existsSync(path.join(destination, 'tooling/oxlint/anti-slop/LICENSE'))).toBe(true)
  expect(existsSync(path.join(destination, 'docs/principles/index.md'))).toBe(true)
})
test('rejects invalid input before writing', () => {
  const destination = path.join(temporaryRoot(), 'project')
  expect(() => validateRequest({ destination, template: 'wrong', name: 'valid-name' })).toThrow(
    'Unknown template',
  )
  expect(() => createProject({ destination, template: 'typescript', name: 'Not Valid' })).toThrow(
    'valid lowercase',
  )
  expect(existsSync(destination)).toBe(false)
})
test('keeps a nonempty destination untouched', () => {
  const destination = path.join(temporaryRoot(), 'project')
  mkdirSync(destination)
  const marker = path.join(destination, 'keep.txt')
  writeFileSync(marker, 'keep me')
  expect(() => createProject({ destination, template: 'node', name: 'safe-project' })).toThrow(
    'already exists',
  )
  expect(readFileSync(marker, 'utf8')).toBe('keep me')
})
test('rejects a dangling destination symlink', () => {
  const root = temporaryRoot()
  const destination = path.join(root, 'project')
  symlinkSync(path.join(root, 'missing'), destination)
  expect(() =>
    createProject({ destination, template: 'typescript', name: 'safe-project' }),
  ).toThrow('symbolic link')
  expect(existsSync(path.join(root, 'missing'))).toBe(false)
})
test('rejects a destination symlink without touching its target', () => {
  const root = temporaryRoot()
  const target = path.join(root, 'target')
  const destination = path.join(root, 'project')
  mkdirSync(target)
  symlinkSync(target, destination)
  expect(() => createProject({ destination, template: 'vue', name: 'safe-project' })).toThrow(
    'symbolic link',
  )
  expect(existsSync(target)).toBe(true)
})
