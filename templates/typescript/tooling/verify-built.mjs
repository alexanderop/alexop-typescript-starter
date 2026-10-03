import assert from 'node:assert/strict'
import { clamp } from '../dist/index.js'
assert.equal(clamp(12, 0, 10), 10)
console.log('Imported and exercised the built library export.')
