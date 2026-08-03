import { ref, watch, type Ref } from 'vue'
import { getTransactionSummary } from '../api/transaction-summary.api'
import type { TransactionSummary } from '../api/transaction-summary.api'
import { listTransactions } from '@/modules/transactions'

export function useTransactionSummary(userId: Ref<number | undefined>, targetDate?: Ref<string>) {
  const summary = ref<TransactionSummary | null>(null)
  async function refreshSummary(): Promise<void> {
    const id = userId.value
    if (!id) { summary.value = null; return }
    try {
      summary.value = await getTransactionSummary(id, { period: 'monthly', ...(targetDate?.value ? { targetDate: targetDate.value } : {}) })
    } catch {
      const [income, expense] = await Promise.all([
        listTransactions({ user_id: id, type: 'income', page: 1, page_size: 100 }),
        listTransactions({ user_id: id, type: 'expense', page: 1, page_size: 100 }),
      ])
      const total = (items: typeof income.items) => items.reduce((sum, item) => sum + Number(item.amount), 0)
      summary.value = { user_id: id, period: 'monthly', start_date: '', end_date: '', income: total(income.items), expense: total(expense.items), balance: total(income.items) - total(expense.items) }
    }
  }
  watch([userId, ...(targetDate ? [targetDate] : [])], refreshSummary, { immediate: true })
  return { summary, refreshSummary }
}
