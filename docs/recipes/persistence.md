# Add browser persistence

Install Dexie when the application needs structured local data:

```sh
pnpm add dexie
```

Create the database adapter inside the feature that owns the records. Validate data at the database boundary. Use a unique database name in browser tests and delete it during cleanup.

Prove persistence in a real browser across a reload. If concurrent tabs can write the same records, test two pages and serialize the read-modify-write operation with Web Locks.
