# Type system discipline

Apply this when designing a signature, handling variants, or reviewing an unsafe
assertion. Use types to prevent mistakes callers are likely to make.

## Make each required case visible

Prefer a discriminated union to unrelated optional fields. Derive types from the
authoritative schema rather than maintaining a second description of its data.
Make operations total when a useful result exists for every accepted input.

```ts
type Result = { kind: 'saved'; path: string } | { kind: 'rejected'; reason: string }

function describe(result: Result): string {
  switch (result.kind) {
    case 'saved':
      return `Saved ${result.path}`
    case 'rejected':
      return result.reason
    default: {
      const unreachable: never = result
      return unreachable
    }
  }
}
```

Brand identifiers when accidental interchange is a real risk. Plain strings are
fine when a brand adds ceremony without preventing a plausible defect. Validate
branded values at construction, and isolate any required assertion in that code.
Prefer narrowing and `satisfies` to assertions that hide a mismatch. An assertion
needs an established invariant, a small scope, and evidence that it holds.
Project lint rules may be stricter. This guidance does not authorize bypassing
configured checks.

## Review and enforcement

Ask, "Which caller mistake does this type prevent?"

Strict checking and exhaustive matches catch missing cases. Type tests can protect
public signatures. The usefulness of a brand and the truth of a runtime invariant
require judgment and, where applicable, runtime validation.

Adapted from [pstack source](https://github.com/cursor/plugins/blob/23e4138daa01c42d4969f7a5465f82704e64f798/pstack/skills/principle-type-system-discipline/SKILL.md).
See [provenance](UPSTREAM.md) and [MIT license](LICENSE).
