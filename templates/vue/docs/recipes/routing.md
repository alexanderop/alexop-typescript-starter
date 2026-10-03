# Add routing

Install Vue Router when the application has multiple addressable views:

```sh
pnpm add vue-router
```

Create the router in `src/app/router.ts` and install it from `src/main.ts`. Application composition owns routes. A feature can export a view component, but it cannot register routes through a hidden side effect.

Cover navigation and direct URL entry in Playwright.
