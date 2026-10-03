# Upstream provenance

- Source: https://github.com/dmmulroy/anti-slop
- Revision: c44ef22ca116d0ba62a3ff663a0bd13a3f3fa40b
- Copied on: 2026-09-20
- Scope: `src/` excluding `src/effect/`, plus the upstream MIT `LICENSE`.
- Local changes: none to copied source or tests. Effect rules are omitted.

The spacing engine retains its own license and provenance in
`vendor/eslint-stylistic/`. Keep both sets of notices when updating.

Stage future upstream revisions separately, compare against this revision, and
review changes before replacing files. Run `pnpm test:lint-rules` and `pnpm verify`.
