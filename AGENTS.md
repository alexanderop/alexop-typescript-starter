# Working in this repository

Use TypeScript with strict checking and Vue 3 `<script setup lang="ts">`. Keep the base small. Add dependencies only for a feature that needs them.

- Read [architecture.md](./docs/architecture.md) before adding a feature or shared module.
- Read [testing.md](./docs/testing.md) before choosing a test layer.
- Read [linting.md](./docs/linting.md) before changing a lint rule or suppression.
- Use an [optional recipe](./docs/recipes/) when the application needs routing, state, persistence, offline support, or UI primitives.

Run `pnpm check` for the fast gate. Run `pnpm verify` before handoff. Test user-visible behavior with semantic locators and a real browser.
