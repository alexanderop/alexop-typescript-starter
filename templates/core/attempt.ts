import { err, ok, type Result } from './result.js'

export function attempt<T, E>(run: () => T, onError: (cause: unknown) => E): Result<T, E> {
  try {
    return ok(run())
  } catch (cause) {
    return err(onError(cause))
  }
}

export async function attemptAsync<T, E>(
  run: () => Promise<T>,
  onError: (cause: unknown) => E,
): Promise<Result<T, E>> {
  try {
    return ok(await run())
  } catch (cause) {
    return err(onError(cause))
  }
}
