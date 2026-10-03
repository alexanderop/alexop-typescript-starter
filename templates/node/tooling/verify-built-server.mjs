import { once } from 'node:events'
import { spawn } from 'node:child_process'

const child = spawn(process.execPath, ['dist/main.js'], {
  env: { ...process.env, PORT: '0' },
  stdio: ['ignore', 'pipe', 'inherit'],
})
try {
  const [chunk] = await once(child.stdout, 'data')
  const match = String(chunk).match(/http:\/\/127\.0\.0\.1:(\d+)/)
  if (!match?.[1]) throw new Error(`Built server did not report its port: ${String(chunk)}`)
  const response = await fetch(`http://127.0.0.1:${match[1]}/health`)
  if (response.status !== 200 || JSON.stringify(await response.json()) !== '{"status":"ok"}')
    throw new Error('Built server returned an unexpected health response.')
  console.log('Started and exercised the built HTTP service.')
} finally {
  child.kill('SIGTERM')
  await once(child, 'exit')
}
