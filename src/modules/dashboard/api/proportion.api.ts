import { normalizeApiError } from '@/shared/api/api-error'
import { httpClient } from '@/shared/api/http-client'

export interface Proportion { label: string; amount: number; percentage: number }
export async function getProportions(userId: number, type: 'expenses' | 'incomes' | 'assets'): Promise<Proportion[]> {
  try {
    const { data } = await httpClient.get<Proportion[]>(`/proportions/${type}`, { params: { user_id: userId } })
    return data
  } catch (error: unknown) { throw normalizeApiError(error) }
}
