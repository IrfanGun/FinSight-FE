function requireEnvironmentVariable(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Environment variable ${name} is required.`)
  }

  return value
}

export const appConfig = Object.freeze({
  apiBaseUrl: requireEnvironmentVariable(
    'VITE_API_BASE_URL',
    import.meta.env.VITE_API_BASE_URL,
  ),
})
