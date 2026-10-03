import { expect, test } from 'vitest'
import { clamp } from './index.js'
test('keeps a number inside the inclusive range', () => {
  expect(clamp(12, 0, 10)).toBe(10)
  expect(clamp(-2, 0, 10)).toBe(0)
  expect(clamp(4, 0, 10)).toBe(4)
})
