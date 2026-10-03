import { andThen, type Result } from '__CORE_MODULE__'
import { createGreeting, type GreetingError } from '../core/greeting.js'

export type NameReadError = { readonly kind: 'name-unavailable'; readonly cause: unknown }
export type ReadName = () => Promise<Result<string, NameReadError>>

export function createLoadGreeting(readName: ReadName) {
  return async (): Promise<Result<string, NameReadError | GreetingError>> => {
    const name = await readName()
    return andThen(name, createGreeting)
  }
}
