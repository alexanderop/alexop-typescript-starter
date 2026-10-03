# Architecture

Organize by feature, then by functional core and imperative shell. Read [the layout, typed errors, and dependency injection guide](./functional-core.md). Each feature owns its business rules, errors, ports, and adapters; shared core contains only general utilities.

Keep core functions pure. Shells coordinate I/O through explicit dependencies and call the core. Compose features through their public entry points in the app layer. The selected profile README describes its package and framework boundaries.

Read the local [principles](./principles/index.md) before changing a boundary.
