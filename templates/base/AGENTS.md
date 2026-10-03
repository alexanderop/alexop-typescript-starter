# Working in this project

Use strict TypeScript. Keep dependencies proportional to the behavior. Read [architecture](./docs/architecture.md), [testing](./docs/testing.md), [linting](./docs/linting.md), and the [engineering principles](./docs/principles/index.md) before changing their areas.

Use [model the domain](./docs/principles/model-the-domain.md) for repeated variants, [boundary discipline](./docs/principles/boundary-discipline.md) for external input, [type system discipline](./docs/principles/type-system-discipline.md) for signatures, [test behavior](./docs/principles/test-behavior.md) for coverage, and [prove it works](./docs/principles/prove-it-works.md) before handoff. When guidance repeats, apply [encode lessons in structure](./docs/principles/encode-lessons-in-structure.md).

Run `pnpm check` during development and `pnpm verify` before handoff.

Organize by feature, with a pure `core/` and an imperative `shell/` inside each feature. Follow [functional core and dependency injection](./docs/functional-core.md): return typed `Result` errors for expected failure, inject I/O dependencies, and translate thrown errors only at adapter boundaries.
