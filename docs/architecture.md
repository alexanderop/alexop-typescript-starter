# Starter kit architecture

`src/templates.mjs` owns the `typescript | node | vue | fullstack` registry and safe filesystem transaction. Each output is a deterministic composition of `templates/base` plus one profile overlay. Common lint, formatting, docs checking, vendored rule source, and agent guidance live once in the base. Root `docs/principles` is canonical and copied verbatim during generation.

The root package is maintainer tooling. It must not acquire DOM, Vue, or browser assumptions. Only Vue-containing overlays carry Vue, `vue-tsc`, Tailwind, browser, and Playwright dependencies.

Fullstack ownership is explicit. `apps/web` may import contracts but not `apps/api`. `packages/contracts` has no package dependencies and may not import runtime or framework modules. ESLint and the workspace check enforce these boundaries.

`templates/core` supplies pure Result helpers and narrowly scoped exception adapters. Generation copies these to `src/shared/core` or the fullstack `packages/core/src`. `templates/feature` supplies a tested feature with separate core and shell; every output carries [feature architecture guidance](../templates/base/docs/functional-core.md).

`templates/vue-shared` contains the Vue naming guide and ESLint style rules copied only into the Vue and fullstack profiles. Their scoped agent instructions link to the generated guide.
