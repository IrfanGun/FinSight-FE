import { normalizeApiError } from '@/shared/api/api-error'
import { httpClient } from '@/shared/api/http-client'
import { mapTransactionListResponse, mapTransactionResponse } from '../lib/transaction.mapper'
import type { ListTransactionsParams, Transaction, TransactionListResponse } from '../types/transaction.types'
export interface TransactionPayload { user_id: number; type: 'income' | 'expense'; amount: number; transaction_date: string; category_id: number; from_account_id: number; description?: string }
export async function createTransaction(payload: TransactionPayload): Promise<Transaction> { try { const { data } = await httpClient.post<unknown>('/transactions', payload); return mapTransactionResponse(data) } catch (e) { throw normalizeApiError(e) } }
export async function updateTransaction(id: number, userId: number, payload: Partial<Omit<TransactionPayload, 'user_id'>>): Promise<Transaction> { try { const { data } = await httpClient.put<unknown>(`/transactions/${id}`, payload, { params: { user_id: userId } }); return mapTransactionResponse(data) } catch (e) { throw normalizeApiError(e) } }
export async function deleteTransaction(id: number, userId: number): Promise<void> { try { await httpClient.delete(`/transactions/${id}`, { params: { user_id: userId } }) } catch (e) { throw normalizeApiError(e) } }

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
