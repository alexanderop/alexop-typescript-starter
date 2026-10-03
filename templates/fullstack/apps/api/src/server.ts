import { createServer, type Server } from 'node:http'
import type { HealthResponse } from '@workspace/contracts'
export function createHttpServer(): Server {
  return createServer((request, response) => {
    response.setHeader('access-control-allow-origin', 'http://127.0.0.1:4173')
    response.setHeader('content-type', 'application/json')
    if (request.method === 'GET' && request.url === '/health') {
      const body: HealthResponse = { status: 'ok' }
      response.writeHead(200).end(JSON.stringify(body))
      return
    }
    response.writeHead(404).end(JSON.stringify({ error: 'not_found' }))
  })
}
