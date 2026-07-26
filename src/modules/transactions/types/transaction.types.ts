export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: number
  user_id: number
  from_account_id: number
  to_account_id: number | null
  category_id: number
  category_name: string
  from_account_name: string
  type: TransactionType
  amount: string
  transaction_date: string
  created_at: string
  updated_at: string
}

export interface ListTransactionsParams {
  user_id: number
  page?: number
  page_size?: number
  type?: TransactionType
  category_id?: number
  account_id?: number
  start_date?: string
  end_date?: string
  search?: string
}

export interface TransactionListResponse {
  items: Transaction[]
  total: number
  page: number
  page_size: number
  total_pages?: number
}
