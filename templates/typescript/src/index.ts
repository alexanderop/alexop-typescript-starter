export function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum)
}

export {
  ok,
  err,
  map,
  mapError,
  andThen,
  match,
  attempt,
  attemptAsync,
  type Result,
} from './shared/core/index.js'
