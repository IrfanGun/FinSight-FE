import { ref, watch, type Ref } from 'vue'
import { getAssetAccounts } from '../api/asset.api'
import type { AssetAccount } from '../api/asset.api'

export function useAssetAccounts(userId: Ref<number | undefined>) {
  const accounts = ref<AssetAccount[]>([])
  watch(userId, async (id) => {
    accounts.value = id ? await getAssetAccounts(id) : []
  }, { immediate: true })
  return { accounts }
}
