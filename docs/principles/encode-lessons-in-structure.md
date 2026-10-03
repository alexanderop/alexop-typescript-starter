# Encode lessons in structure

Apply this when the same correction recurs or a documented rule is easy to miss.
Choose a mechanism that prevents the observed mistake at its source.

## Turn a repeated correction into a check

Identify the failure and the code that owns the rule. Prefer a type when the rule
is static, a lint or import check for code structure, and a runtime check for data
or state the compiler cannot know. Use a canonical helper when it removes
inconsistent implementations without hiding a needed choice.

For example, parse a retry limit once rather than asking every caller to remember
its allowed range. Keep both accepted and rejected cases in a regression check.

```ts
function parseRetryLimit(value: unknown): number {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new Error('Retry limit must be an integer')
  }
  if (value < 0 || value > 5) {
    throw new Error('Retry limit must be between 0 and 5')
  }
  return value
}
```

Before adding a lint rule, try it against legitimate code as well as the defect.
Prefer a small check with an actionable error to a broad rule with many exceptions.
Keep concise documentation for intent, usage, and decisions that require judgment.
Remove repeated reminders when the check already enforces them.

## Review and enforcement

Ask, "Will the next occurrence fail visibly without someone remembering this page?"

A compiler, lint rule, script, or runtime guard can enforce a precise condition.
Deciding whether a correction is recurring, choosing the mechanism, and measuring
its false positives require judgment. Do not automate an unclear policy.

Adapted from [pstack source](https://github.com/cursor/plugins/blob/23e4138daa01c42d4969f7a5465f82704e64f798/pstack/skills/principle-encode-lessons-in-structure/SKILL.md).
See [provenance](UPSTREAM.md) and [MIT license](LICENSE).
