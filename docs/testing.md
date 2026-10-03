# Testing the kit

Generator tests call the public creation API and inspect observable filesystem results. They cover all profiles, invalid input, existing targets, and symlink collisions.

`pnpm verify:templates` is the release proof. It generates all four profiles into a temporary directory, strips the maintainer checkout from the environment, performs frozen installs, and runs each consumer's `pnpm verify`. Node tests bind a real ephemeral HTTP port. Vue uses Browser Mode and a built preview. Fullstack starts its built API plus built web preview and observes the API response in Chromium.
