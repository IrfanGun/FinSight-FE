import type { Transaction } from '../types/transaction.types'

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object'
}

export function validateTransaction(value: unknown): Transaction {
  if (
    !isRecord(value) ||
    typeof value.id !== 'number' ||
    typeof value.user_id !== 'number' ||
    typeof value.from_account_id !== 'number' ||
    (value.to_account_id !== null && typeof value.to_account_id !== 'number') ||
    typeof value.category_id !== 'number' ||
    typeof value.category_name !== 'string' ||
    typeof value.from_account_name !== 'string' ||
    (value.type !== 'income' && value.type !== 'expense') ||
    (typeof value.amount !== 'string' && typeof value.amount !== 'number') ||
    typeof value.transaction_date !== 'string' ||
    typeof value.created_at !== 'string' ||
    typeof value.updated_at !== 'string'
  ) {
    throw new Error('Invalid transaction response.')
  }

  return {
    id: value.id,
    user_id: value.user_id,
    from_account_id: value.from_account_id,
    to_account_id: value.to_account_id,
    category_id: value.category_id,
    category_name: value.category_name,
    from_account_name: value.from_account_name,
    type: value.type,
    amount: String(value.amount),
    transaction_date: value.transaction_date,
    created_at: value.created_at,
    updated_at: value.updated_at,
  }
}

export function validateTransactionCollection(value: unknown): Transaction[] {
  if (!Array.isArray(value)) throw new Error('Invalid transaction list response.')
  return value.map(validateTransaction)
}
