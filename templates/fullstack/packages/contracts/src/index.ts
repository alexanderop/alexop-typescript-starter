export interface HealthResponse {
  readonly status: 'ok'
}

export function parseHealthResponse(input: unknown): HealthResponse {
  if (
    typeof input !== 'object' ||
    input === null ||
    !('status' in input) ||
    input.status !== 'ok'
  ) {
    throw new Error('Invalid health response')
  }
  return { status: input.status }
}
