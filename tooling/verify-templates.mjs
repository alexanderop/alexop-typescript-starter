import { lstatSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { createProject, templateIds } from '../src/templates.mjs'

const sourceRoot = path.resolve(import.meta.dirname, '..')
const temporaryRoot = mkdtempSync(path.join(tmpdir(), 'alexop typescript starter-'))

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
  if (environment.PATH)
    environment.PATH = environment.PATH.split(path.delimiter)
      .filter((entry) => !entry.startsWith(path.join(sourceRoot, 'node_modules')))
      .join(path.delimiter)
  return environment
}
/** @param {string} cwd @param {string} command @param {string[]} commandArguments */
function run(cwd, command, commandArguments) {
  const result = spawnSync(command, commandArguments, {
    cwd,
    env: cleanEnvironment(),
    stdio: 'inherit',
  })
  if (result.error) throw result.error
  if (result.status !== 0)
    throw new Error(`${command} ${commandArguments.join(' ')} failed for ${path.basename(cwd)}`)
}
/** @param {string} projectRoot */
function inspectStandalone(projectRoot) {
  const sourcePath = sourceRoot.split(path.sep).join('/')
  for (const relativeFile of readdirSync(projectRoot, { recursive: true })) {
    if (typeof relativeFile !== 'string' || relativeFile.startsWith('node_modules/')) continue
    const filename = path.join(projectRoot, relativeFile)
    if (!lstatSync(filename).isFile()) continue
    if (readFileSync(filename).includes(sourcePath))
      throw new Error(`${relativeFile} contains the source workspace path`)
  }
}
try {
  for (const template of templateIds) {
    const projectRoot = path.join(temporaryRoot, template)
    createProject({ destination: projectRoot, template, name: `verify-${template}` })
    inspectStandalone(projectRoot)
    run(projectRoot, 'pnpm', [
      'install',
      '--frozen-lockfile',
      '--store-dir',
      path.join(temporaryRoot, 'store'),
    ])
    run(projectRoot, 'pnpm', ['verify'])
  }
} finally {
  rmSync(temporaryRoot, { force: true, recursive: true })
}
console.log(`Verified ${templateIds.length} isolated templates.`)
