import { expect, test } from 'vitest'
import { readFileSync } from 'node:fs'

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

test('keeps the documented public commands available', () => {
  expect(Object.keys(packageJson.scripts)).toEqual(
    expect.arrayContaining(['dev', 'build', 'check', 'verify', 'verify:template']),
  )
})
