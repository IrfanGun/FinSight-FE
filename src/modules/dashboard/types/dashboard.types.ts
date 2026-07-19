export const ASSET_TYPES = {
  WALLET: 'wallet',
  BANK: 'bank',
  INVESTMENT: 'investment',
} as const

export type AssetType = (typeof ASSET_TYPES)[keyof typeof ASSET_TYPES]
export type TransactionType = 'income' | 'expense'

export interface AssetSummary {
  type: AssetType
  label: string
  amount: string
  detail: string
  icon: string
  accentClass: string
}

export interface CashflowSummary {
  income: string
  expense: string
  incomeChange: string
  expenseChange: string
}

export interface RecentTransaction {
  id: number
  merchant: string
  category: string
  date: string
  amount: string
  type: TransactionType
  icon: string
  iconClass: string
}

export interface ExpenseProportion {
  label: string
  value: number
  colorClass: string
}
