import type { Transaction } from '@/modules/transactions'
import type { RecentTransaction } from '../types/dashboard.types'

export function mapRecentTransaction(transaction: Transaction): RecentTransaction {
  const income = transaction.type === 'income'
  return {
    id: transaction.id,
    merchant: transaction.from_account_name,
    category: transaction.category_name,
    date: transaction.transaction_date,
    amount: new Intl.NumberFormat('id-ID').format(Number(transaction.amount)),
    type: transaction.type,
    icon: income ? 'pi-arrow-down-left' : 'pi-shopping-cart',
    iconClass: income ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700',
  }
}
