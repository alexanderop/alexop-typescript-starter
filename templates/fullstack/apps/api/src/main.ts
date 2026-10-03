import { createHttpServer } from './server.ts'
const port = Number.parseInt(process.env.PORT ?? '4310', 10)
createHttpServer().listen(port, '127.0.0.1', () =>
  console.log(`API listening on http://127.0.0.1:${port}`),
)
