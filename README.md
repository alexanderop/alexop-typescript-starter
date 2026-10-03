# alexop.dev frontend starter

A cloneable Vue 3 starter with strict TypeScript, Tailwind CSS, Vite+, architecture checks, and real-browser tests.

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm dev
```

Run `pnpm check` during development. Run `pnpm verify` before delivery. Maintainers can run `pnpm verify:template` to prove that a fresh copy installs and passes the same checks.

Read [AGENTS.md](./AGENTS.md) before changing the structure or test setup. Optional dependencies stay in [docs/recipes](./docs/recipes/).
