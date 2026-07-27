import { normalizeApiError } from '@/shared/api/api-error'
import { httpClient } from '@/shared/api/http-client'

export interface TransactionSummary {
  user_id: number
  period: string
  start_date: string
  end_date: string
  income: number
  expense: number
  balance: number
}

export async function getTransactionSummary(
  userId: number,
  options: { period?: string; targetDate?: string } = {},
  signal?: AbortSignal,
): Promise<TransactionSummary> {
  try {
    const targetDate = options.targetDate ?? new Date().toISOString().slice(0, 10)
    const { data } = await httpClient.get<TransactionSummary>('/transactions/summary', {
      params: { user_id: userId, period: options.period ?? 'monthly', target_date: targetDate }, signal,
    })
    return data
  } catch (error: unknown) { throw normalizeApiError(error) }
}
