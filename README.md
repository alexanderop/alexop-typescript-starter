# alexop-typescript-starter

A starter kit by [alexop.dev](https://alexop.dev) for standalone strict TypeScript projects, with Vite+, a shared Oxlint policy, and local engineering principles linked from `AGENTS.md`.

```sh
git clone https://github.com/alexanderop/alexop-typescript-starter.git
cd alexop-typescript-starter
pnpm install --frozen-lockfile
pnpm create:project ../my-app --template fullstack --name my-app
cd ../my-app
pnpm install --frozen-lockfile
pnpm dev
```

Choose `typescript` for a library, `node` for a native HTTP service, `vue` for a browser app, or `fullstack` for a pnpm workspace with Vue, Node, and shared contracts. Generated projects own their tools, lockfile, docs, and checks. They do not depend on this checkout.

Use Node 22.22 or newer and pnpm 10. For the library profile, run `pnpm build` instead of `pnpm dev`. Before verifying a Vue or fullstack project, install its browser with `pnpm exec playwright install chromium`.

The [principles](./docs/principles/index.md) cover domain modeling, boundaries, types, readability, behavior tests, verification, and turning recurring lessons into checks. They are adapted from pstack, with pinned [upstream attribution and licensing](./docs/principles/UPSTREAM.md), and copied into every generated project.

Run `pnpm verify` for the maintainer code. Run `pnpm verify:templates` to generate, install with frozen lockfiles, and verify every profile in isolation. Read [AGENTS.md](./AGENTS.md) and the [kit architecture](./docs/architecture.md) before changing composition.
