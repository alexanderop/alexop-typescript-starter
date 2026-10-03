# **PROJECT_NAME**

A strict TypeScript service using the native Node HTTP server.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm verify
```

`GET /health` returns `{ "status": "ok" }`. Tests bind an ephemeral port and exercise both the health and missing-route responses over HTTP. Read [AGENTS.md](./AGENTS.md) first.
