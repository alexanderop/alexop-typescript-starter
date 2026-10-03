import { spawnSync } from 'node:child_process'
import { cpSync, lstatSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

const sourceRoot = path.resolve(import.meta.dirname, '..')
const temporaryRoot = mkdtempSync(path.join(tmpdir(), 'alexop-frontend-starter-'))
const copyRoot = path.join(temporaryRoot, 'project')
const excluded = new Set([
  '.git',
  '.pnpm-store',
  '.vite-plus',
  '.vitest',
  'dist',
  'node_modules',
  'playwright-report',
  'test-results',
])

function rejectSymlinks(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (excluded.has(entry.name)) continue
    const target = path.join(directory, entry.name)
    if (lstatSync(target).isSymbolicLink()) {
      throw new Error(`Template input cannot be a symlink: ${target}`)
    }
    if (entry.isDirectory()) rejectSymlinks(target)
  }
}

function cleanEnvironment() {
  const environment = Object.fromEntries(
    Object.entries(process.env).filter(([name]) => {
      const normalized = name.toLowerCase()
      return (
        !normalized.startsWith('npm_config_') &&
        normalized !== 'pnpm_home' &&
        normalized !== 'node_path'
      )
    }),
  )
  if (environment.PATH) {
    environment.PATH = environment.PATH.split(path.delimiter)
      .filter((entry) => !entry.startsWith(path.join(sourceRoot, 'node_modules')))
      .join(path.delimiter)
  }
  return environment
}

function run(command, arguments_) {
  const result = spawnSync(command, arguments_, {
    cwd: copyRoot,
    env: cleanEnvironment(),
    stdio: 'inherit',
  })
  if (result.error) throw result.error
  if (result.status !== 0) process.exitCode = result.status ?? 1
  return result.status === 0
}

try {
  rejectSymlinks(sourceRoot)
  cpSync(sourceRoot, copyRoot, {
    recursive: true,
    dereference: false,
    filter: (source) => !excluded.has(path.basename(source)) && !source.endsWith('.tsbuildinfo'),
  })

  const sourcePath = sourceRoot.split(path.sep).join('/')
  const copiedFiles = readdirSync(copyRoot, { recursive: true })
  for (const relativeFile of copiedFiles) {
    if (typeof relativeFile !== 'string') continue
    const absoluteFile = path.join(copyRoot, relativeFile)
    if (!lstatSync(absoluteFile).isFile()) continue
    if (readFileSync(absoluteFile).includes(sourcePath)) {
      throw new Error(`Copied file contains the source workspace path: ${relativeFile}`)
    }
  }

  if (
    run('pnpm', ['install', '--frozen-lockfile', '--store-dir', path.join(temporaryRoot, 'store')])
  ) {
    run('pnpm', ['verify'])
  }
} finally {
  rmSync(temporaryRoot, { force: true, recursive: true })
}
