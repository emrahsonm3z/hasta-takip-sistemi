const REQUIRED_ENV_VARS = ['VITE_API_URL'] as const

type RequiredEnvVar = (typeof REQUIRED_ENV_VARS)[number]

const rawEnv: Record<string, unknown> = import.meta.env ?? {}

export class EnvConfigError extends Error {
  readonly missingVars: readonly string[]

  constructor(missingVars: readonly string[]) {
    super(`Missing required environment variables: ${missingVars.join(', ')}`)
    this.name = 'EnvConfigError'
    this.missingVars = missingVars
  }
}

export function findMissingEnvVars(source: Record<string, unknown>): RequiredEnvVar[] {
  return REQUIRED_ENV_VARS.filter((key) => {
    const value = source[key]
    return value === undefined || value === null || value === ''
  })
}

export function validateRequiredEnvVars(source: Record<string, unknown> = rawEnv): void {
  const missing = findMissingEnvVars(source)
  if (missing.length > 0) {
    throw new EnvConfigError(missing)
  }
}

const apiUrlValue = rawEnv.VITE_API_URL

export const env = Object.freeze({
  apiUrl: typeof apiUrlValue === 'string' ? apiUrlValue : '',
})
