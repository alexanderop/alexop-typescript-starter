import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import path from 'node:path'

export const templateIds = /** @type {const} */ (['typescript', 'node', 'vue', 'fullstack'])
/** @typedef {(typeof templateIds)[number]} TemplateId */
const templateRoot = path.resolve(import.meta.dirname, '..', 'templates')
/** @type {Readonly<Record<TemplateId, { readonly description: string }>>} */
export const templates = {
  typescript: { description: 'Strict TypeScript library' },
  node: { description: 'Native Node HTTP service' },
  vue: { description: 'Vue 3 browser application' },
  fullstack: { description: 'pnpm workspace with Vue web, Node API, and contracts' },
}
const packageNamePattern = /^(?:@[a-z0-9][a-z0-9._-]*\/[a-z0-9][a-z0-9._-]*|[a-z0-9][a-z0-9._-]*)$/

/** @param {unknown} value @returns {value is TemplateId} */
export function isTemplateId(value) {
  return typeof value === 'string' && Object.hasOwn(templates, value)
}
/** @param {{ destination: string, template: unknown, name: unknown }} input */
export function validateRequest(input) {
  if (typeof input.destination !== 'string' || input.destination.length === 0)
    throw new Error('A string destination is required.')
  if (!isTemplateId(input.template))
    throw new Error(`Unknown template. Choose one of: ${templateIds.join(', ')}.`)
  if (typeof input.name !== 'string' || !packageNamePattern.test(input.name))
    throw new Error('Name must be a valid lowercase npm package name.')
  return {
    destination: path.resolve(input.destination),
    template: input.template,
    name: input.name,
  }
}
/** @param {string} destination */
function assertWritableDestination(destination) {
  const stat = lstatSync(destination, { throwIfNoEntry: false })
  if (!stat) return
  if (stat.isSymbolicLink()) throw new Error('Destination cannot be a symbolic link.')
  throw new Error('Destination already exists. Choose a new path.')
}
/** @param {string} directory */
function rejectSourceSymlinks(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name)
    if (lstatSync(target).isSymbolicLink())
      throw new Error(`Template source cannot be a symbolic link: ${target}`)
    if (entry.isDirectory()) rejectSourceSymlinks(target)
  }
}
/** @param {string} root @param {string} name */
function applyProjectName(root, name) {
  const packageFiles = [
    'package.json',
    'README.md',
    'apps/web/package.json',
    'apps/api/package.json',
    'packages/contracts/package.json',
  ]
  for (const relativeFile of packageFiles) {
    const filename = path.join(root, relativeFile)
    if (!existsSync(filename)) continue
    writeFileSync(
      filename,
      readFileSync(filename, 'utf8')
        .replaceAll('__PROJECT_NAME__', name)
        .replaceAll('**PROJECT_NAME**', name),
    )
  }
}
/** @param {{ destination: string, template: unknown, name: unknown }} rawInput */
export function createProject(rawInput) {
  const input = validateRequest(rawInput)
  assertWritableDestination(input.destination)
  const parent = path.dirname(input.destination)
  mkdirSync(parent, { recursive: true })
  rejectSourceSymlinks(path.join(templateRoot, 'base'))
  rejectSourceSymlinks(path.join(templateRoot, 'core'))
  rejectSourceSymlinks(path.join(templateRoot, 'feature'))
  rejectSourceSymlinks(path.join(templateRoot, input.template))
  rejectSourceSymlinks(path.resolve(import.meta.dirname, '..', 'docs', 'principles'))
  const temporary = mkdtempSync(path.join(parent, `.${path.basename(input.destination)}-`))
  try {
    cpSync(path.join(templateRoot, 'base'), temporary, { recursive: true })
    cpSync(path.join(templateRoot, input.template), temporary, { recursive: true })
    cpSync(
      path.resolve(import.meta.dirname, '..', 'docs', 'principles'),
      path.join(temporary, 'docs', 'principles'),
      { recursive: true },
    )
    const corePath = input.template === 'fullstack' ? 'packages/core/src' : 'src/shared/core'
    cpSync(path.join(templateRoot, 'core'), path.join(temporary, corePath), { recursive: true })
    copyExampleFeature(temporary, input.template)
    applyProjectName(temporary, input.name)
    renameSync(temporary, input.destination)
  } catch (error) {
    rmSync(temporary, { force: true, recursive: true })
    throw error
  }
  return input.destination
}

/** @param {string} root @param {TemplateId} template */
function copyExampleFeature(root, template) {
  const fullstack = template === 'fullstack'
  const destination = path.join(
    root,
    fullstack ? 'apps/api/src/features/greeting' : 'src/features/greeting',
  )
  cpSync(path.join(templateRoot, 'feature'), destination, { recursive: true })
  for (const relative of readdirSync(destination, { recursive: true })) {
    if (typeof relative !== 'string') continue
    const filename = path.join(destination, relative)
    if (!lstatSync(filename).isFile()) continue
    writeFileSync(
      filename,
      readFileSync(filename, 'utf8').replaceAll(
        '__CORE_MODULE__',
        fullstack ? '@workspace/core' : '../../../shared/core/index.js',
      ),
    )
  }
}
