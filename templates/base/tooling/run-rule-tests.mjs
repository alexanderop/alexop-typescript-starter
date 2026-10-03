import { readdirSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { checkVendoredSource } from './check-vendor.mjs'

checkVendoredSource(fileURLToPath(new URL('./oxlint/', import.meta.url)))

const directory = new URL('./oxlint/anti-slop/rules/', import.meta.url)
const enabledRules = [
  'no-chained-type-assertions',
  'no-conditional-empty-object-spread',
  'no-known-value-widening',
  'no-reduce-accumulator-copy',
  'no-widen-then-assert',
]
const availableTests = new Set(readdirSync(directory).filter((name) => name.endsWith('.test.ts')))

for (const rule of enabledRules) {
  const test = `${rule}.test.ts`
  if (!availableTests.has(test)) throw new Error(`Missing rule test: ${test}`)

  const result = spawnSync(
    process.execPath,
    ['--experimental-strip-types', fileURLToPath(new URL(test, directory))],
    { stdio: 'inherit' },
  )
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}

console.log(`Passed ${enabledRules.length} enabled anti-slop rule suites.`)
