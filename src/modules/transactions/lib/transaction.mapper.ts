import type { ListTransactionsParams, TransactionListResponse } from '../types/transaction.types'
import { validateTransaction, validateTransactionCollection } from './transaction.validator'

export function mapTransactionListResponse(
  value: unknown,
  params: ListTransactionsParams,
): TransactionListResponse {
  if (Array.isArray(value)) {
    const items = validateTransactionCollection(value)
    return { items, total: items.length, page: params.page ?? 1, page_size: params.page_size ?? items.length }
  }

  if (value && typeof value === 'object' && 'items' in value) {
    const response = value as { items?: unknown; total?: unknown; page?: unknown; page_size?: unknown; total_pages?: unknown }
    const items = validateTransactionCollection(response.items)
    return {
      items,
      total: typeof response.total === 'number' ? response.total : items.length,
      page: typeof response.page === 'number' ? response.page : params.page ?? 1,
      page_size: typeof response.page_size === 'number' ? response.page_size : params.page_size ?? items.length,
      total_pages: typeof response.total_pages === 'number' ? response.total_pages : undefined,
    }
  }

  throw new Error('Invalid transaction list response.')
}

export function mapTransactionResponse(value: unknown) {
  return validateTransaction(value)
}
