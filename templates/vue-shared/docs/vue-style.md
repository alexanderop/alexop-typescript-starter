# Vue component naming and templates

Use the conventions below in both Vue profiles, following the [Vue Priority B style guide](https://vuejs.org/style-guide/rules-strongly-recommended.html). These are this starter's choices where the guide permits alternatives.

## Names reveal ownership

- Put one component in each `.vue` file. Use PascalCase filenames, imports, and component tags in SFC templates: `SearchInputQuery.vue` and `<SearchInputQuery />`.
- Prefix shared presentational primitives with `Base`: `BaseButton.vue`, `BaseDialog.vue`. Place them in `src/shared/ui`. Do not prefix feature components with `Base` merely because they contain no business logic.
- Prefix tightly coupled children with their parent: `SearchResults.vue`, `SearchResultsItem.vue`, `SearchResultsItemActions.vue`.
- Order names from general to specific: `SearchButtonRun.vue`, `SearchButtonClear.vue`, `SettingsCheckboxNotifications.vue`.
- Prefer full words and multi-word component names. Avoid names such as `UsrPrfOpts.vue`. The root `App.vue` is an exception to the multi-word convention.

Keep naming consistent with feature-based functional core / imperative shell architecture. Vue components live in a feature's `shell/`, pure TypeScript decisions live in its `core/`, and application wiring imports the feature's public entry point. Naming does not justify moving feature-specific components into shared code.

```text
src/features/search/
  core/
    search-query.ts
  shell/
    SearchPanel.vue
    SearchPanelResults.vue
    SearchPanelResultsItem.vue
    SearchButtonRun.vue
  index.ts
src/shared/ui/
  BaseButton.vue
```

## Template conventions

Declare props in camelCase; pass them in kebab-case in SFC templates. Self-close empty component tags. Quote attribute values with double quotes. Use `:`, `@`, and `#` directive shorthands consistently. Put multiple attributes on separate lines; `pnpm format` handles this.

```vue
<SearchButtonRun :is-loading="isLoading" @click="runSearch" />
```

Keep template expressions simple. Move parsing, transformations, and multi-step decisions into named computed values or pure core functions. Split computed values when each intermediate concept has a useful name, rather than extracting every arithmetic operation mechanically.

These rules target compiled SFCs. Raw in-DOM templates need kebab-case component tags and explicit closing tags for custom elements. Do not mechanically apply SFC self-closing conventions to raw HTML.

## Enforcement

ESLint checks filename casing, matching component imports, component tag casing, prop and attribute casing, empty component tags, quotes, directive shorthand, and attributes per line. Oxfmt uses `singleAttributePerLine` so formatting agrees with linting. Both Vue profiles share the same rule module and executable lint fixtures.

Full words, the right Base/parent prefix, general-to-specific word order, and useful computed boundaries remain review decisions. A linter cannot reliably infer those relationships. Native custom elements may require an explicit template-casing exception in the project configuration.
