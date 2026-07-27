import { ref, watch, type Ref } from 'vue'
import { getProportions, type Proportion } from '../api/proportion.api'
export function useProportions(userId: Ref<number | undefined>) {
  const proportions = ref<Record<'expenses' | 'incomes' | 'assets', Proportion[]>>({ expenses: [], incomes: [], assets: [] })
  watch(userId, async (id) => { if (!id) return; const [expenses, incomes, assets] = await Promise.all([getProportions(id, 'expenses'), getProportions(id, 'incomes'), getProportions(id, 'assets')]); proportions.value = { expenses, incomes, assets } }, { immediate: true })
  return { proportions }
}
