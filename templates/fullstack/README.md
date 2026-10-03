# **PROJECT_NAME**

A pnpm workspace with a Vue web application, native Node HTTP API, and framework-neutral contracts.

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm dev
```

Run `pnpm check` during development and `pnpm verify` before handoff. The final Playwright journey starts the built API and web preview, then asserts the API health response rendered in the browser. Read [AGENTS.md](./AGENTS.md) and the scoped guidance in each application.
