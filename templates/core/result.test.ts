import { expect, expectTypeOf, test, vi } from 'vitest'
import { andThen, err, map, mapError, match, ok, type Result } from './result.js'
import { attempt, attemptAsync } from './attempt.js'

test('transforms success and preserves errors without running later operations', () => {
  expect(map(ok(2), (value) => value * 3)).toEqual(ok(6))
  const failure = err({ kind: 'not-found' })
  const next = vi.fn<() => Result<number, never>>(() => ok(42))
  expect(andThen(failure, next)).toBe(failure)
  expect(next).not.toHaveBeenCalled()
  expect(map(failure, next)).toBe(failure)
  expect(next).not.toHaveBeenCalled()
})

test('composes different error types and handles either outcome', () => {
  const initial: Result<number, 'missing'> = ok(2)
  const result = andThen(initial, (): Result<string, 'invalid'> => err('invalid'))
  expectTypeOf(result).toEqualTypeOf<Result<string, 'missing' | 'invalid'>>()
  expect(mapError(result, (error) => ({ kind: error }))).toEqual(err({ kind: 'invalid' }))
  expect(match(result, { ok: (value) => value, err: (error) => error })).toBe('invalid')
  expect(andThen(ok(2), (value) => ok(value + 1))).toEqual(ok(3))
  expect(match(ok(2), { ok: (value) => value * 2, err: () => 0 })).toBe(4)
})

test('adapts thrown foreign values at a synchronous boundary', () => {
  const cause = new Error('SDK failed')
  expect(
    attempt(
      () => 42,
      () => 'failed',
    ),
  ).toEqual(ok(42))
  expect(
    attempt(
      () => {
        throw cause
      },
      (error) => ({ kind: 'sdk', cause: error }),
    ),
  ).toEqual(err({ kind: 'sdk', cause }))
})

test('adapts promise rejections and synchronous throws from async dependencies', async () => {
  const failure = () => ({ kind: 'unavailable' })
  expect(await attemptAsync(() => Promise.resolve(42), failure)).toEqual(ok(42))
  expect(await attemptAsync(() => Promise.reject(new Error('offline')), failure)).toEqual(
    err({ kind: 'unavailable' }),
  )
  expect(
    await attemptAsync(() => {
      throw new Error('before promise')
    }, failure),
  ).toEqual(err({ kind: 'unavailable' }))
})

test('does not disguise a bug in an error mapper as a typed failure', () => {
  expect(() =>
    attempt(
      () => {
        throw new Error('input')
      },
      () => {
        throw new Error('mapper bug')
      },
    ),
  ).toThrow('mapper bug')
})
