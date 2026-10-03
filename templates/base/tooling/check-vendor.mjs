import { createHash } from 'node:crypto'
import { readFileSync, realpathSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/** @param {string} oxlintRoot */
export function checkVendoredSource(oxlintRoot) {
  const manifest = readFileSync(path.join(oxlintRoot, 'anti-slop.sha256'), 'utf8')
    .trim()
    .split('\n')
  for (const line of manifest) {
    const [expected, relativeFile] = line.split(/\s+\.?\//)
    if (!expected || !relativeFile) throw new Error(`Invalid vendor manifest line: ${line}`)
    const actual = createHash('sha256')
      .update(readFileSync(path.join(oxlintRoot, 'anti-slop', relativeFile)))
      .digest('hex')
    if (actual !== expected) throw new Error(`Vendored source changed: ${relativeFile}`)
  }
  return manifest.length
}

if (
  process.argv[1] &&
  realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))
) {
  const root = process.argv[2]
    ? path.resolve(process.argv[2])
    : path.resolve(import.meta.dirname, 'oxlint')
  console.log(`Verified ${checkVendoredSource(root)} pristine vendored files.`)
}
