import { readFileSync } from 'node:fs'
const contracts = JSON.parse(
  readFileSync(new URL('../packages/contracts/package.json', import.meta.url), 'utf8'),
)
if (contracts.dependencies || contracts.devDependencies)
  throw new Error('The contracts package must have no runtime or framework dependencies.')
console.log('Workspace package boundaries are valid.')
