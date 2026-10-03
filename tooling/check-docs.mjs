import { readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const packageJson = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'))
const requiredScripts = [
  'dev',
  'build',
  'check',
  'verify',
  'verify:template',
  'test',
  'test:unit',
  'test:browser',
  'test:e2e',
  'test:rules',
]

for (const script of requiredScripts) {
  if (typeof packageJson.scripts?.[script] !== 'string') {
    throw new Error(`package.json is missing the ${script} script`)
  }
}

const entryDocs = ['README.md', 'AGENTS.md']
const docsDirectory = path.join(root, 'docs')
const docs = readdirSync(docsDirectory, { recursive: true })
  .filter((name) => typeof name === 'string' && name.endsWith('.md'))
  .map((name) => path.join('docs', name))
const markdownFiles = [...entryDocs, ...docs]

for (const relativeFile of markdownFiles) {
  const absoluteFile = path.join(root, relativeFile)
  const content = readFileSync(absoluteFile, 'utf8')
  const links = content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)
  for (const match of links) {
    const target = match[1]
    if (!target || /^(?:https?:|mailto:|#)/.test(target)) continue
    const [targetPath] = target.split('#')
    if (!targetPath) continue
    const resolved = path.resolve(path.dirname(absoluteFile), targetPath)
    if (!statSync(resolved, { throwIfNoEntry: false })) {
      throw new Error(`${relativeFile} links to missing ${target}`)
    }
  }
  for (const line of content.split('\n')) {
    const command = line.match(/(?:^|`)pnpm ([\w:-]+)/)?.[1]
    if (!command || ['add', 'exec', 'install'].includes(command)) continue
    if (typeof packageJson.scripts?.[command] !== 'string') {
      throw new Error(`${relativeFile} documents missing pnpm script ${command}`)
    }
  }
}

const agents = readFileSync(path.join(root, 'AGENTS.md'), 'utf8')
for (const requiredDoc of [
  './docs/architecture.md',
  './docs/testing.md',
  './docs/linting.md',
  './docs/recipes/',
]) {
  if (!agents.includes(requiredDoc)) {
    throw new Error(`AGENTS.md must link to ${requiredDoc}`)
  }
}

console.log(`Checked ${markdownFiles.length} documentation files.`)
