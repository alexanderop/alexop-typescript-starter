import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const fixtureRoot = mkdtempSync(path.join(root, 'tooling', '.lint-proof-'))

/**
 * @typedef {object} AcceptProof
 * @property {'accept'} kind
 * @property {string} fixture
 * @property {string} file
 * @property {string} ruleId
 *
 * @typedef {object} RejectProof
 * @property {'reject'} kind
 * @property {string} fixture
 * @property {string} file
 * @property {string} ruleId
 *
 * @typedef {AcceptProof | RejectProof} LintProof
 */

/** @type {LintProof[]} */
const proofs = [
  {
    kind: 'accept',
    file: 'chained.valid.ts',
    ruleId: 'anti-slop/no-chained-type-assertions',
    fixture:
      "declare const input: unknown\nexport const value = typeof input === 'string' ? input : undefined\n",
  },
  {
    kind: 'reject',
    file: 'chained.invalid.ts',
    ruleId: 'anti-slop/no-chained-type-assertions',
    fixture: 'declare const input: unknown\nexport const value = input as unknown as string\n',
  },
  {
    kind: 'accept',
    file: 'conditional.valid.ts',
    ruleId: 'anti-slop/no-conditional-empty-object-spread',
    fixture: 'declare const enabled: boolean\nexport const value = enabled ? { enabled } : {}\n',
  },
  {
    kind: 'reject',
    file: 'conditional.invalid.ts',
    ruleId: 'anti-slop/no-conditional-empty-object-spread',
    fixture:
      'declare const enabled: boolean\nexport const value = { ...(enabled ? { enabled } : {}) }\n',
  },
  {
    kind: 'accept',
    file: 'known.valid.ts',
    ruleId: 'anti-slop/no-known-value-widening',
    fixture: "export const labels = { ready: 'Ready' } as const\n",
  },
  {
    kind: 'reject',
    file: 'known.invalid.ts',
    ruleId: 'anti-slop/no-known-value-widening',
    fixture: 'export const value: unknown = 1\n',
  },
  {
    kind: 'accept',
    file: 'reduce.valid.ts',
    ruleId: 'anti-slop/no-reduce-accumulator-copy',
    fixture:
      'const values = [1, 2]\nexport const total = values.reduce((sum, value) => sum + value, 0)\n',
  },
  {
    kind: 'reject',
    file: 'reduce.invalid.ts',
    ruleId: 'anti-slop/no-reduce-accumulator-copy',
    fixture:
      'const values = [1, 2]\nexport const copy = values.reduce((items, value) => items.concat([value]), [])\n',
  },
  {
    kind: 'accept',
    file: 'widen.valid.ts',
    ruleId: 'anti-slop/no-widen-then-assert',
    fixture: 'declare const input: unknown\nexport const value = input\n',
  },
  {
    kind: 'reject',
    file: 'widen.invalid.ts',
    ruleId: 'anti-slop/no-widen-then-assert',
    fixture:
      "const source = { id: 'second' }\nconst widened: unknown = source\nexport const value = widened as { readonly id: string }\n",
  },
]

function proveLint(proof) {
  const filename = path.join(fixtureRoot, proof.file)
  writeFileSync(filename, proof.fixture)
  const result = spawnSync('pnpm', ['exec', 'vp', 'lint', '--deny-warnings', filename], {
    cwd: root,
    encoding: 'utf8',
  })
  if (result.error) throw result.error

  const output = `${result.stdout}\n${result.stderr}`
  if (proof.kind === 'accept' && result.status !== 0) {
    throw new Error(`${proof.file} was rejected:\n${output}`)
  }
  if (proof.kind === 'reject' && result.status === 0) {
    throw new Error(`${proof.file} was accepted; expected ${proof.ruleId}`)
  }
  const diagnosticRule = `${proof.ruleId.replace('/', '(')})`
  if (proof.kind === 'reject' && !output.includes(diagnosticRule)) {
    throw new Error(`${proof.file} did not report ${proof.ruleId}:\n${output}`)
  }
}

try {
  for (const proof of proofs) proveLint(proof)
} finally {
  rmSync(fixtureRoot, { force: true, recursive: true })
}

console.log(`Passed ${proofs.length} configured lint proofs.`)
