import { err, ok, type Result } from '__CORE_MODULE__'

export type GreetingError = { readonly kind: 'invalid-name' }

export function createGreeting(name: string): Result<string, GreetingError> {
  const trimmed = name.trim()
  return trimmed.length === 0 ? err({ kind: 'invalid-name' }) : ok(`Hello, ${trimmed}!`)
}
