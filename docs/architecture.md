# Starter kit architecture

`src/templates.mjs` owns the `typescript | node | vue | fullstack` registry and safe filesystem transaction. Each output is a deterministic composition of `templates/base` plus one profile overlay. Common lint, formatting, docs checking, vendored rule source, and agent guidance live once in the base. Root `docs/principles` is canonical and copied verbatim during generation.

The root package is maintainer tooling. It must not acquire DOM, Vue, or browser assumptions. Only Vue-containing overlays carry Vue, `vue-tsc`, Tailwind, browser, and Playwright dependencies.

Fullstack ownership is explicit. `apps/web` may import contracts but not `apps/api`. `packages/contracts` has no package dependencies and may not import runtime or framework modules. ESLint and the workspace check enforce these boundaries.
