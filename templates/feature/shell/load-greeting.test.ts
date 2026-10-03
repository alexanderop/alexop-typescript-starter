import { expect, test } from 'vitest'
import { err, ok } from '__CORE_MODULE__'
import { createLoadGreeting, type NameReadError } from './load-greeting.js'

test('composes the injected adapter with the pure core', async () => {
  const load = createLoadGreeting(() => Promise.resolve(ok('Alex')))
  expect(await load()).toEqual(ok('Hello, Alex!'))
})

test('preserves an adapter failure and a domain failure as distinct errors', async () => {
  const failure: NameReadError = { kind: 'name-unavailable', cause: new Error('offline') }
  const unavailable = createLoadGreeting(() => Promise.resolve(err(failure)))
  const invalid = createLoadGreeting(() => Promise.resolve(ok(' ')))
  expect(await unavailable()).toEqual(err(failure))
  expect(await invalid()).toEqual(err({ kind: 'invalid-name' }))
})
