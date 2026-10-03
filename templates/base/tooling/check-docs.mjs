import { existsSync, readFileSync, readdirSync, realpathSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const ignoredDirectories = new Set([
  '.git',
  'dist',
  'node_modules',
  'oxlint',
  'playwright-report',
  'test-results',
])

/** @param {string} root @param {string} directory */
function collectMarkdown(root, directory = root) {
  const files = []
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name))
        files.push(...collectMarkdown(root, path.join(directory, entry.name)))
      continue
    }
    if (entry.isFile() && (entry.name.endsWith('.md') || entry.name === 'AGENTS.md'))
      files.push(path.relative(root, path.join(directory, entry.name)))
  }
  return files
}

/** @param {string} root */
export function checkDocumentation(root) {
  const packageJson = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'))
  const files = collectMarkdown(root)
  for (const relativeFile of files) {
    const absoluteFile = path.join(root, relativeFile)
    const content = readFileSync(absoluteFile, 'utf8')
    for (const match of content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      const target = match[1] ?? ''
      if (!target || /^(?:https?:|mailto:|#)/.test(target)) continue
      const targetPath = target.split('#')[0]
      if (targetPath && !existsSync(path.resolve(path.dirname(absoluteFile), targetPath)))
        throw new Error(`${relativeFile} links to missing ${target}`)
    }
    for (const line of content.split('\n')) {
      const command = line.match(/(?:^|`)pnpm ([\w:-]+)/)?.[1] ?? ''
      if (!command || ['add', 'exec', 'install', '--filter'].includes(command)) continue
      if (typeof packageJson.scripts?.[command] !== 'string')
        throw new Error(`${relativeFile} documents missing pnpm script ${command}`)
    }
  }
  return files.length
}

if (
  process.argv[1] &&
  realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))
) {
  const requestedRoot = process.argv[2]
  console.log(
    `Checked ${checkDocumentation(requestedRoot ? path.resolve(requestedRoot) : path.resolve(import.meta.dirname, '..'))} documentation files.`,
  )
}
