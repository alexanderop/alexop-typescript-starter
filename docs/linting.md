# Linting policy

`templates/base/tooling/vite-shared.ts` is the authoritative Vite+ lint and format policy consumed by the kit and every output. It enables strict native TypeScript rules plus five curated custom rules from the pristine vendored source in `tooling/oxlint/anti-slop`.

Every generated project runs the five upstream rule suites and fourteen configured command-line proofs (including functional-core guards). Vue profiles add ESLint only for SFC and architecture rules. Change the shared policy, fixture proofs, and docs together.
