import { createHttpServer } from './server.ts'
const port = Number.parseInt(process.env.PORT ?? '3000', 10)
const server = createHttpServer()
server.listen(port, '127.0.0.1', () => {
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('Expected a TCP address')
  console.log(`API listening on http://127.0.0.1:${address.port}`)
})
