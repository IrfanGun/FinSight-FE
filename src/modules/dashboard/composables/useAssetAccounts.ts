import { ref, watch, type Ref } from 'vue'
import { getAssetAccounts } from '../api/asset.api'
import type { AssetAccount } from '../api/asset.api'

export function useAssetAccounts(userId: Ref<number | undefined>) {
  const accounts = ref<AssetAccount[]>([])
  async function fetchAccounts(id = userId.value): Promise<void> {
    accounts.value = id ? await getAssetAccounts(id) : []
  }
  watch(userId, async (id) => {
    await fetchAccounts(id)
  }, { immediate: true })
  return { accounts, fetchAccounts }
}
