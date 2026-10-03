# Functional core, imperative shell

Organize by feature first. Every feature owns its pure decisions and its I/O orchestration:

```text
src/
  app/                       # composition and wiring
  features/
    greeting/
      index.ts               # public feature API
      core/                  # pure functions, domain types, typed errors
      shell/                 # injected I/O, workflows, UI adapters
  shared/core/               # Result and boundary conversion helpers
```

In a fullstack workspace, each application owns its features. The runnable greeting example is in `apps/api/src/features/greeting`, and general helpers live in `packages/core`, imported as `@workspace/core`. Wire browser features in `apps/web/src/features` the same way. Keep shared wire shapes in `packages/contracts`.

## Errors are values

Return `Result<T, E>` for expected failure. Narrow on `result.ok`, then switch on the error's `kind`. Each feature owns its error union; avoid a global catch-all application error. Keep errors readonly and data-oriented. Do not serialize internal causes to clients.

The core provides `ok`, `err`, `map`, `mapError`, `andThen`, and `match`. Use ordinary `if` and `switch` when clearer. `andThen` combines error unions and skips later work on failure. There is no throwing `unwrap` helper.

Use `attempt` for synchronous throwing APIs and `attemptAsync` for promises that reject or functions that throw before returning a promise. Always await asynchronous work with `attemptAsync`; `attempt` does not catch promise rejections. Convert errors narrowly at an adapter boundary and preserve the cause for diagnostics. Do not wrap whole business workflows to hide programming defects. Callback bugs may still throw: TypeScript cannot encode a guarantee that JavaScript never throws or that a promise never rejects.

## Inject behavior with functions

The included `createLoadGreeting(readName)` factory accepts a `ReadName` function. Its shell awaits the adapter and passes successful data to the pure `createGreeting` core. Tests pass a small fake directly, without mocking modules or constructing a DI container.

Wire an adapter at the application entry point:

```ts
import { attemptAsync } from './shared/core/index.js'
import { createLoadGreeting, type ReadName } from './features/greeting/index.js'

export function wireGreeting(readNameFromStorage: () => Promise<string>) {
  const readName: ReadName = () =>
    attemptAsync(readNameFromStorage, (cause) => ({ kind: 'name-unavailable', cause }))
  return createLoadGreeting(readName)
}
```

In fullstack code use `@workspace/core` for the first import. For several related operations, inject a small readonly capability object. Create dependencies once in `src/app`, `main.ts`, or the server entry point. Avoid service locators, singleton registries, decorators, and generic dependency containers.

## Keep the direction explicit

Shells call cores. Cores must not import shells, UI frameworks, Node APIs, storage, network clients, or another feature. Pass time, IDs, randomness, and external state in as values. Define capability types near their consuming feature; implement them in its shell or a shared adapter. Compose features at the application layer through public entry points. Shared code never imports features.

Tests beside `core/` cover decisions with plain values. Shell tests inject deterministic fakes for control flow; adapter integration tests exercise the real runtime boundary. Retain browser and HTTP journeys for wiring that unit tests cannot prove. Shared Oxlint overrides reject common runtime imports, shell imports, clock access, global I/O, and `Math.random` inside feature cores. These checks are guardrails, not proof of purity: injected callbacks, aliases, unlisted packages, and mutable inputs still need review.

Keep helpers proportional. Add a utility only after a real use case needs it. For substantial concurrency, retries, cancellation, resource lifetimes, or service graphs, prefer the project's Effect approach rather than growing this module into a second effect system.
