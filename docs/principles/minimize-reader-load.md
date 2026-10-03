# Minimize reader load

Apply this when a change requires tracing many forwarding functions, finding
hidden mutations, or keeping several synchronized values in mind.

## Keep dependencies and state visible

Follow one concrete question through the code, such as where a total comes from.
Remove indirection that adds no decision, ownership, or useful boundary. Keep an
adapter when it isolates I/O or a dependency, even if it has one implementation.
A single caller alone is not a reason to inline a useful named operation.

Prefer local values to shared mutable state. Derive a value when storing it would
require every update path to keep another value synchronized.

```ts
type Line = Readonly<{ priceInCents: number; quantity: number }>

function totalInCents(lines: readonly Line[]): number {
  return lines.reduce((total, line) => total + line.priceInCents * line.quantity, 0)
}

const total = totalInCents([{ priceInCents: 250, quantity: 2 }])
```

This function has no cached total to update. If measurements justify a cache,
make its owner and invalidation rule explicit. Do not replace a readable loop
with a chain of helpers just to reduce line count.

## Review and enforcement

Ask, "Can a reader find where this value comes from and what can change it?"

Lint rules can flag unused code and forbidden imports. Tests can catch stale
state. Whether a name, abstraction, or cache reduces reading effort takes judgment.

Adapted from [pstack source](https://github.com/cursor/plugins/blob/23e4138daa01c42d4969f7a5465f82704e64f798/pstack/skills/principle-minimize-reader-load/SKILL.md).
See [provenance](UPSTREAM.md) and [MIT license](LICENSE).
