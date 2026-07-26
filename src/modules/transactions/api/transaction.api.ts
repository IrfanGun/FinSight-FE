import { normalizeApiError } from '@/shared/api/api-error'
import { httpClient } from '@/shared/api/http-client'
import { mapTransactionListResponse, mapTransactionResponse } from '../lib/transaction.mapper'
import type { ListTransactionsParams, Transaction, TransactionListResponse } from '../types/transaction.types'

/** Mengambil transaksi milik user dengan pagination dan filter opsional. */
export async function listTransactions(
  params: ListTransactionsParams,
  signal?: AbortSignal,
): Promise<TransactionListResponse> {
  try {
    const { data } = await httpClient.get<unknown>('/transactions', {
      params,
      signal,
    })
    return mapTransactionListResponse(data, params)
  } catch (error: unknown) {
    throw normalizeApiError(error)
  }
}

/** Mengambil detail transaksi milik user. */
export async function getTransaction(
  transactionId: number,
  userId: number,
  signal?: AbortSignal,
): Promise<Transaction> {
  try {
    const { data } = await httpClient.get<unknown>(`/transactions/${transactionId}`, {
      params: { user_id: userId },
      signal,
    })
    return mapTransactionResponse(data)
  } catch (error: unknown) {
    throw normalizeApiError(error)
  }
}
