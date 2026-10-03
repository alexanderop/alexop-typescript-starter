# Prove it works

Apply this before declaring a change complete or making a claim about its result.
Match each claim to evidence from the artifact that users consume.

## Verify the result directly

Start with the affected behavior. Run the relevant checks and inspect the actual
diff. A typecheck proves type consistency. A successful build proves that the
build completed. Neither establishes that a user can complete a journey.

For a generated project, create a fresh project, install its dependencies, and run
its documented commands. For a library, exercise its built exports as a consumer.
For a CLI, run its executable. For a UI, inspect the changed browser behavior.
For deployment claims, verify the deployed version and behavior at its real URL.

When the result is a file, inspect its contents. This example checks a JSON output
whose contract requires a saved record. It runs in a TypeScript setup with Node.

```ts
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const actual: unknown = JSON.parse(await readFile('result.json', 'utf8'))
assert.deepEqual(actual, { status: 'saved', id: 'record-1' })
```

Retain a reusable check when the risk or repeated work warrants it. Inspect the
observation method if a check gives a surprising result. Use fresh evidence for
the current artifact. Distinguish a failed check from a check that could not run.

## Review and enforcement

Ask, "What observation supports the exact claim I am about to make?"

CI can enforce executable checks. Selecting adequate evidence and reporting its
limits takes judgment. State what passed and any material behavior left unverified.

Adapted from [pstack source](https://github.com/cursor/plugins/blob/23e4138daa01c42d4969f7a5465f82704e64f798/pstack/skills/principle-prove-it-works/SKILL.md).
See [provenance](UPSTREAM.md) and [MIT license](LICENSE).
