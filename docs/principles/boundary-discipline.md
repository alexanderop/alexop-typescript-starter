# Boundary discipline

Apply this when data enters through HTTP, storage, a file, environment variables,
a CLI, a browser event, or a public library API.

## Parse once at each trust boundary

Accept unknown input and turn it into a domain value or an explicit error.
Keep transport details in adapters. Give domain functions the values they need,
with dependencies passed explicitly when behavior requires I/O.

```ts
function parseRetryCount(input: unknown): number {
  if (typeof input !== 'number' || !Number.isInteger(input) || input < 0) {
    throw new Error('Retry count must be a nonnegative integer')
  }
  return input
}

const payload: unknown = JSON.parse('3')
const retryCount = parseRetryCount(payload)
```

Use the project's schema library when several fields or reusable schemas make
manual parsing harder to maintain. Derive types from that schema where possible.
Avoid revalidating the same immutable value in every internal function.

Types do not protect against mutation, stale storage, races, JavaScript callers,
or unsafe assertions. Keep runtime checks for authorization, resource ownership,
and invariants that can change after parsing. Validate again at a new trust
boundary or after an operation that can invalidate those assumptions.

## Review and enforcement

Ask, "What establishes this value's validity, and what could invalidate it?"

Import rules can keep domain modules independent of framework adapters. Tests can
exercise malformed input and changing invariants. Selecting trust boundaries and
mapping failures to useful public errors takes judgment.

Adapted from [pstack source](https://github.com/cursor/plugins/blob/23e4138daa01c42d4969f7a5465f82704e64f798/pstack/skills/principle-boundary-discipline/SKILL.md).
See [provenance](UPSTREAM.md) and [MIT license](LICENSE).
