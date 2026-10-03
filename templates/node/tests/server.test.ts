import { once } from 'node:events'
import type { Server } from 'node:http'
import { afterEach, expect, test } from 'vitest'
import { createHttpServer } from '../src/server.js'

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
async function startServer() {
  const server = createHttpServer()
  servers.push(server)
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('Expected a TCP address')
  return `http://127.0.0.1:${address.port}`
}
test('serves health and rejects an unknown path over HTTP', async () => {
  const origin = await startServer()
  const health = await fetch(`${origin}/health`)
  expect(health.status).toBe(200)
  expect(await health.json()).toEqual({ status: 'ok' })
  const missing = await fetch(`${origin}/missing`)
  expect(missing.status).toBe(404)
  expect(await missing.json()).toEqual({ error: 'not_found' })
})
