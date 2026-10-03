import { expect, test } from 'vitest'
import { createGreeting } from './greeting.js'

test('formats a valid name without changing the input', () => {
  expect(createGreeting(' Alex ')).toEqual({ ok: true, value: 'Hello, Alex!' })
})

test('returns a typed error for an empty name', () => {
  expect(createGreeting('  ')).toEqual({ ok: false, error: { kind: 'invalid-name' } })
})
