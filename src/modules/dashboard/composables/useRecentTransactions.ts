import { onMounted, ref } from 'vue'
import { listTransactions } from '@/modules/transactions'
import type { Transaction } from '@/modules/transactions'
import { mapRecentTransaction } from '../mappers/dashboard.mapper'
import type { RecentTransaction } from '../types/dashboard.types'

export function useRecentTransactions(userId: () => number | undefined) {
  const transactions = ref<RecentTransaction[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchRecentTransactions(): Promise<void> {
    if (!userId()) return
    isLoading.value = true
    error.value = null
    try {
      const response = await listTransactions({ user_id: userId()!, page: 1, page_size: 5 })
      transactions.value = response.items
        .sort((left, right) => right.transaction_date.localeCompare(left.transaction_date))
        .slice(0, 5)
        .map(mapRecentTransaction)
    } catch {
      transactions.value = []
      error.value = 'Transaksi gagal dimuat.'
    } finally { isLoading.value = false }
  }

  onMounted(fetchRecentTransactions)
  return { transactions, isLoading, error, fetchRecentTransactions }
}
