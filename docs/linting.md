# Linting policy

`templates/base/tooling/vite-shared.ts` is the authoritative Vite+ lint and format policy consumed by the kit and every output. It enables strict native TypeScript rules plus five curated custom rules from the pristine vendored source in `tooling/oxlint/anti-slop`.

Every generated project runs the five upstream rule suites and fourteen configured command-line proofs (including functional-core guards). Vue profiles add ESLint only for SFC and architecture rules. Change the shared policy, fixture proofs, and docs together.

Vue and fullstack share `templates/vue-shared/tooling/eslint/vue-style.mjs`. It enforces mechanical SFC naming and template conventions; [the Vue style guide](../templates/vue-shared/docs/vue-style.md) documents semantic naming decisions such as parent prefixes and word order.
