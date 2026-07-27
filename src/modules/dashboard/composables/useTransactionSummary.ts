import { ref, watch, type Ref } from 'vue'
import { getTransactionSummary } from '../api/transaction-summary.api'
import type { TransactionSummary } from '../api/transaction-summary.api'

export function useTransactionSummary(userId: Ref<number | undefined>) {
  const summary = ref<TransactionSummary | null>(null)
  watch(userId, async (id) => { summary.value = id ? await getTransactionSummary(id, { period: 'monthly' }) : null }, { immediate: true })
  return { summary }
}
