# Add offline installation

Install `vite-plugin-pwa` only when offline use and installation are product requirements:

```sh
pnpm add -D vite-plugin-pwa
```

Add the plugin to `vite.config.ts`. Define the manifest, icons, and caching policy for the application. Test the installed worker against a production build. Cover one offline reload and one update path in Playwright.
