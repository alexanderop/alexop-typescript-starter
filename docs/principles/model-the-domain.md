# Model the domain

Apply this when state has several related flags, branches repeat across files,
or a new feature exposes an invalid combination of fields.

## Choose a shape that expresses the rules

Write down the states users can reach and the operations that change them.
Use a discriminated union when each state carries different data. Use a map
when lookup by identity is the central operation. Keep a plain object when it
already expresses the rules clearly.

Group code by the knowledge it owns. A module for invoice rules has a clearer
owner than separate modules for each step that reads the same invoice fields.
Do not introduce a state machine library for a transition a function can express.

```ts
type Job = { kind: 'queued'; id: string } | { kind: 'finished'; id: string; output: string }

function finish(job: Extract<Job, { kind: 'queued' }>, output: string): Job {
  return { kind: 'finished', id: job.id, output }
}

const finished = finish({ kind: 'queued', id: 'job-1' }, 'report.csv')
```

The finished state always carries its output. Concurrency, ownership, and valid
transitions still need checks where the application changes shared state.

## Review and enforcement

Ask, "Which invalid state can a caller still construct?"

The compiler can reject missing variant fields. Tests can check transitions and
runtime invariants. Choosing the right states and module ownership takes judgment.

Adapted from [pstack source](https://github.com/cursor/plugins/blob/23e4138daa01c42d4969f7a5465f82704e64f798/pstack/skills/principle-model-the-domain/SKILL.md).
See [provenance](UPSTREAM.md) and [MIT license](LICENSE).
