import { once } from 'node:events'
import type { Server } from 'node:http'
import { afterEach, expect, test } from 'vitest'
import { createHttpServer } from './server.js'
const servers: Server[] = []
afterEach(async () =>
  Promise.all(
    servers
      .splice(0)
      .map(
        (server) =>
          new Promise((resolve, reject) =>
            server.close((error?: Error) => (error ? reject(error) : resolve(undefined))),
          ),
      ),
  ),
)
test('serves the contract and a 404 over HTTP', async () => {
  const server = createHttpServer()
  servers.push(server)
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('Expected TCP address')
  const origin = `http://127.0.0.1:${address.port}`
  const health = await fetch(`${origin}/health`)
  expect(await health.json()).toEqual({ status: 'ok' })
  const missing = await fetch(`${origin}/missing`)
  expect(missing.status).toBe(404)
})
