# Testing behavior

Write the observable scenario before choosing a runner. Use Given, When, and Then to name the starting state, the action, and the result.

- Put pure TypeScript tests next to their source as `*.test.ts`. Run them with `pnpm test:unit`.
- Put Vue interaction tests in `tests/browser/`. Vitest Browser Mode runs them in Chromium with production browser APIs.
- Put built-application journeys in `tests/e2e/`. Playwright starts the production preview and covers startup plus application boundaries.

Use semantic locators such as roles, names, and labels. Test keyboard behavior for interactive controls. Assert what a user can observe. Do not inspect private component state.

`pnpm test` runs both Vitest projects. `pnpm verify` also builds the application and runs Playwright against that build.
