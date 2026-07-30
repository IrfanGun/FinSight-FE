import { normalizeApiError } from '@/shared/api/api-error'
import { httpClient } from '@/shared/api/http-client'
import type { CreateFinanceAccountRequest, FinanceAccount } from '../types/chat.types'

export async function createFinanceAccount(
  request: CreateFinanceAccountRequest,
  signal?: AbortSignal,
): Promise<FinanceAccount> {
  try {
    const { data } = await httpClient.post<FinanceAccount>('/finance-accounts', request, { signal })
    return data
  } catch (error: unknown) {
    throw normalizeApiError(error)
  }
}
