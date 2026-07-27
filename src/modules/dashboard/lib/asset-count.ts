export function extractAssetAccounts(value: unknown): unknown[] {
  if (Array.isArray(value)) return value
  if (!value || typeof value !== 'object') throw new Error('Invalid assets response.')
  const response = value as Record<string, unknown>
  if (Array.isArray(response.data)) return response.data
  if (Array.isArray(response.items)) return response.items
  if (response.data && typeof response.data === 'object' && Array.isArray((response.data as Record<string, unknown>).items)) {
    return (response.data as Record<string, unknown>).items as unknown[]
  }
  throw new Error('Invalid assets response.')
}
