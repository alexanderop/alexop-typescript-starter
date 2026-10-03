# Source audit

This template sampled recurring configuration and testing choices from these relative workspace roots:

```text
../../games/hex-snake
../../games/outpost-zero
../../games/crownwatch
../foolscap
../chalkframe
../../finance
../../content/blog-astro
../vue-ai-starter
../vue-agent-starter
../vue-pwa-starter
../vue-template
```

The audit covered seven application roots and four starter roots. The broad scan found recurring strict TypeScript flags, a complexity limit of 10, bans on explicit `any`, nested ternaries, and assertion escapes, plus distinct unit, browser, and end-to-end test tiers.

Architecture rules differed by application domain. This template copies the general feature ownership rule from `vue-ai-starter` because its tests cover aliases, relative imports, dynamic imports, re-exports, and Vite globs. It does not copy an application-specific package matrix.

The anti-slop source, tests, license, and upstream revision came from `vue-agent-starter`. The enabled list is smaller than the vendored plugin. The Vite+ wiring follows the local pattern in `nuxt-starter/vite.config.ts`, with current compatible package versions from the npm registry.

This is the first runnable Vue template from the audit. The plain TypeScript and tooling ideas may transfer to other frameworks, but the template is not a React or Nuxt preset.
