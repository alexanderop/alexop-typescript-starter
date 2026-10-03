# Linting policy

Vite+ runs Oxlint 1.85.0 and Oxfmt 0.70.0 through the project-local `vp` binary. ESLint adds Vue SFC checks and the feature-boundary rule. `vue-tsc` remains the Vue type gate.

Vite+ reports its core package as version 1.0.0. The workspace override supplies that package wherever tools request Vite, so pnpm permits the expected Vite and Vitest peer ranges. Exact Vite+ and browser-test versions keep the override reviewable.

The repository vendors the anti-slop plugin in `tooling/oxlint/anti-slop/` with its tests, license, and upstream revision. `vite.config.ts` enables five rules whose diagnostics fit ordinary frontend code:

- `anti-slop/no-chained-type-assertions`
- `anti-slop/no-conditional-empty-object-spread`
- `anti-slop/no-known-value-widening`
- `anti-slop/no-reduce-accumulator-copy`
- `anti-slop/no-widen-then-assert`

Rules that reject `unknown`, runtime `typeof` checks, or object parameters remain available but disabled. Boundary code needs safe narrowing and ordinary object-shaped APIs.

`pnpm test:rules` runs each enabled rule's vendored unit suite and then invokes the configured `vp lint` command against one valid and one invalid fixture per rule. Change the configuration, unit tests, and CLI proofs together.
