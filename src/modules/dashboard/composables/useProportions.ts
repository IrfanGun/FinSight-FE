import { ref, watch, type Ref } from 'vue'
import { getProportions, type Proportion } from '../api/proportion.api'
import { listTransactions } from '@/modules/transactions'
import { getAssetAccounts } from '../api/asset.api'
export function useProportions(userId: Ref<number | undefined>) {
  const proportions = ref<Record<'expenses' | 'incomes' | 'assets', Proportion[]>>({ expenses: [], incomes: [], assets: [] })
  watch(userId, async (id) => {
    if (!id) return
    try {
      const [expenses, incomes, accountList] = await Promise.all([
        getProportions(id, 'expenses'),
        getProportions(id, 'incomes'),
        getAssetAccounts(id),
      ])
      const assetGroups = new Map<string, number>()
      const validAssetTypes = new Set(['wallet', 'bank', 'investment'])
      accountList
        .filter((account) => validAssetTypes.has(account.type))
        .forEach((account) => assetGroups.set(account.type, (assetGroups.get(account.type) ?? 0) + account.balance))
      const assetTotal = [...assetGroups.values()].reduce((sum, value) => sum + value, 0)
      const assets: Proportion[] = [...assetGroups].map(([label, amount]) => ({ label: label.charAt(0).toUpperCase() + label.slice(1), amount, percentage: assetTotal ? Math.round(amount / assetTotal * 100) : 0 }))
      // Endpoint proporsi bisa valid tetapi mengembalikan array kosong.
      // Dalam kondisi itu chart tetap perlu diisi dari transaksi.
      if (incomes.length > 0 || expenses.length > 0 || assets.length > 0) {
        proportions.value = { expenses, incomes, assets }
        if (incomes.length > 0 && expenses.length > 0) return
      }
      throw new Error('Empty proportions response')
    } catch {
      const [response, accounts] = await Promise.all([
        listTransactions({ user_id: id, page: 1, page_size: 100 }),
        getAssetAccounts(id).catch(() => []),
      ])
      const build = (type: 'income' | 'expense'): Proportion[] => {
        const grouped = new Map<string, number>()
        response.items.filter((item) => item.type === type).forEach((item) => grouped.set(item.category_name, (grouped.get(item.category_name) ?? 0) + Number(item.amount)))
        const total = [...grouped.values()].reduce((sum, value) => sum + value, 0)
        return [...grouped].map(([label, amount]) => ({ label, amount, percentage: total ? Math.round(amount / total * 100) : 0 }))
      }
      const assetGroups = new Map<string, number>()
      const validAssetTypes = new Set(['wallet', 'bank', 'investment'])
      accounts
        .filter((account) => validAssetTypes.has(account.type))
        .forEach((account) => assetGroups.set(account.type, (assetGroups.get(account.type) ?? 0) + account.balance))
      const assetTotal = [...assetGroups.values()].reduce((sum, value) => sum + value, 0)
      const assets: Proportion[] = [...assetGroups].map(([label, amount]) => ({
        label: label.charAt(0).toUpperCase() + label.slice(1),
        amount,
        percentage: assetTotal ? Math.round(amount / assetTotal * 100) : 0,
      }))
      proportions.value = { expenses: build('expense'), incomes: build('income'), assets }
    }
  }, { immediate: true })
  return { proportions }
}
