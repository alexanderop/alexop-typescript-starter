# Working on alexop-typescript-starter

This repository maintains the generator and profile sources. It is not a Vue application. Keep shared policy in `templates/base` and profile behavior in `templates/<id>`. Generated outputs must remain standalone.

Use these principles when the task triggers them:

- Model repeated variants with the [domain model](./docs/principles/model-the-domain.md).
- Validate CLI, network, and config input with [boundary discipline](./docs/principles/boundary-discipline.md).
- Design strict public signatures with [type system discipline](./docs/principles/type-system-discipline.md).
- Reduce indirection with [minimize reader load](./docs/principles/minimize-reader-load.md).
- Assert observable outcomes with [test behavior](./docs/principles/test-behavior.md).
- Exercise the real generated artifact with [prove it works](./docs/principles/prove-it-works.md).
- Turn repeated guidance into checks with [encode lessons in structure](./docs/principles/encode-lessons-in-structure.md).

Read [architecture](./docs/architecture.md), [testing](./docs/testing.md), and [linting](./docs/linting.md) before changing those systems. Run `pnpm check` while working, `pnpm verify` before handoff, and `pnpm verify:templates` after changing generated output.
