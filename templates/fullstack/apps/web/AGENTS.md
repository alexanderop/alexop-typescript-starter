# Web application

Use Vue 3 `<script setup lang="ts">`. Import shared response types from `@workspace/contracts`. Never import the API application. Read [test behavior](../../docs/principles/test-behavior.md) before changing a user flow. Run `pnpm check` and `pnpm verify` from the workspace root.

Follow [Vue naming and template conventions](../../docs/vue-style.md): PascalCase components, Base-prefixed shared primitives, parent-prefixed children, and general-to-specific full-word names. Keep Vue components in feature shells and pure decisions in feature cores.
