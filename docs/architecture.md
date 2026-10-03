# Application architecture

`src/App.vue` and `src/main.ts` own application composition. A feature lives in `src/features/<feature>/` and exposes its public API through `index.ts`. Code outside a feature must import that entry point.

Feature internals can import files in the same feature and `src/shared/`. A feature cannot import another feature or application composition. Shared code cannot import a feature or application composition. The ESLint rule in `tooling/eslint/feature-boundaries.mjs` checks static imports, re-exports, dynamic imports, aliases, and Vite globs.

Start a new feature with the smallest files its behavior needs:

```text
src/features/search/
  index.ts
  SearchPanel.vue
```

Import the entry point from application composition:

```ts
import { SearchPanel } from '@/features/search'
```

Keep browser adapters near the feature that owns them. Move code to `src/shared/` only when at least two features use the same domain-independent behavior.

The starter is a template instead of a package. Each application owns and can edit its rules without a preset release or peer-dependency contract. Extract a package after multiple applications require the same stable policy.
