import { createServer, type Server } from 'node:http'

export function createHttpServer(): Server {
  return createServer((request, response) => {
    response.setHeader('content-type', 'application/json')
    if (request.method === 'GET' && request.url === '/health') {
      response.writeHead(200).end(JSON.stringify({ status: 'ok' }))
      return
    }
    response.writeHead(404).end(JSON.stringify({ error: 'not_found' }))
  })
}
