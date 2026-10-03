# Add state and asynchronous workflows

Keep local UI state in Vue refs and computed values. Add Pinia when several components need shared client state. Install it with `pnpm add pinia`, create the store inside its owning feature, and install one Pinia instance in `src/main.ts`.

Use Effect for substantial asynchronous workflows, typed errors, resource lifecycles, or services. Install the current compatible Effect release only when the feature needs those capabilities. Keep Effect services outside Vue components. Use `@effect/atom-vue` when Effect-backed state must integrate with Vue.

After either addition, prove one real consumer through `pnpm verify`.
