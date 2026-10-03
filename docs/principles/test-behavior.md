# Test behavior

Apply this when adding a test, reviewing coverage, or replacing a brittle test.
Exercise the contract through the interface its consumer uses.

## Choose the boundary that can fail

Use Node tests for pure rules and filesystem behavior. Test an HTTP API through
HTTP when routing, serialization, authentication, or status codes matter. Exercise
UI interaction in a real browser. Use an integrated journey for behavior that
depends on several real parts, such as saving, restarting, and reading the result.
For a CLI, execute the command and inspect its exit status, output, and files.

The following self-contained Vitest example checks a rule's observable result.
In an application test, import the rule from its owning module.

```ts
import { expect, test } from 'vitest'

function remainingAttempts(limit: number, used: number): number {
  return Math.max(0, limit - used)
}

test('attempts stop at zero', () => {
  expect(remainingAttempts(3, 1)).toBe(2)
  expect(remainingAttempts(3, 4)).toBe(0)
})
```

Choose expected values independently of the implementation. Test doubles belong
at boundaries where they make failures or time controllable. Assert meaningful
payloads or outcomes when the boundary interaction itself is the contract.
Absence is valid behavior, such as no write after rejected input. Establish the
trigger and observe the actual resource so a broken setup cannot pass silently.

## Review and enforcement

Ask, "What plausible defect would make this test fail?"

Runners enforce assertions and timeouts. Mutation checks can expose weak coverage.
Choosing the right boundary and a representative failure still takes judgment.

Adapted from [pstack source](https://github.com/cursor/plugins/blob/23e4138daa01c42d4969f7a5465f82704e64f798/pstack/skills/principle-test-behavior-not-implementation/SKILL.md).
See [provenance](UPSTREAM.md) and [MIT license](LICENSE).
