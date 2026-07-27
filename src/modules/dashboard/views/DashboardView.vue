<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import AssetOverview from '../components/AssetOverview.vue'
import CashflowSummary from '../components/CashflowSummary.vue'
import DashboardHeader from '../components/DashboardHeader.vue'
import ProportionIncomeExpenses from '../components/ProportionIncomeExpenses.vue'
import RecentTransactions from '../components/RecentTransactions.vue'
import { DASHBOARD_ASSETS, DASHBOARD_CASHFLOW, DASHBOARD_PROPORTIONS } from '../constants/dashboard.constants'
import { useRecentTransactions } from '../composables/useRecentTransactions'
import { useAssetAccounts } from '../composables/useAssetAccounts'
import { useTransactionSummary } from '../composables/useTransactionSummary'
import { useProportions } from '../composables/useProportions'
import type { AssetSummary } from '../types/dashboard.types'

const router = useRouter()
const authStore = useAuthStore()
const userName = computed(() => authStore.currentUser?.fullName ?? 'Pengguna')
const { transactions } = useRecentTransactions(() => authStore.currentUser?.id)
const { accounts } = useAssetAccounts(computed(() => authStore.currentUser?.id))
const { summary: transactionSummary } = useTransactionSummary(computed(() => authStore.currentUser?.id))
const { proportions } = useProportions(computed(() => authStore.currentUser?.id))
const cashflow = computed(() => ({
  income: formatCurrency(transactionSummary.value?.income ?? 0),
  expense: formatCurrency(transactionSummary.value?.expense ?? 0),
  incomeChange: '', expenseChange: '',
}))
const assets = ref<AssetSummary[]>(DASHBOARD_ASSETS.map((asset) => ({ ...asset, amount: 'Rp 0', detail: asset.type === 'wallet' ? '0 wallet' : asset.type === 'bank' ? '0 rekening' : '0 portofolio' })))

const formatCurrency = (amount: number) => `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`

watch(accounts, (accountList) => {
  const grouped = [...new Set(accountList.map((account) => account.type))]
    assets.value = grouped.map((type) => {
      const items = accountList.filter((item) => item.type === type)
      return {
      type: type as AssetSummary['type'], label: type.charAt(0).toUpperCase() + type.slice(1),
      amount: formatCurrency(items.reduce((total, item) => total + item.balance, 0)), detail: `${items.length} akun`,
      icon: type === 'bank' ? 'pi-building-columns' : type === 'investment' ? 'pi-chart-line' : 'pi-wallet',
      accentClass: type === 'bank' ? 'bg-blue-100 text-blue-700' : type === 'investment' ? 'bg-brand-100 text-brand-700' : 'bg-amber-100 text-amber-700',
      }
    })
}, { immediate: true })

function handleSignOut(): void { authStore.signOut(); void router.push({ name: 'auth.login' }) }
</script>

<template>
  <div class="min-h-screen bg-[#f7faf9]"><DashboardHeader :user-name="userName" @sign-out="handleSignOut" /><main class="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:px-12"><header><p class="mb-1 text-sm font-semibold text-brand-700">Dashboard</p><h1 class="m-0 text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">Ringkasan keuangan</h1><p class="mt-2 text-sm text-slate-500">Pantau kondisi keuangan Anda hari ini.</p></header><AssetOverview :assets="assets" /><CashflowSummary :summary="cashflow" /><div class="grid gap-6 lg:grid-cols-[1.15fr_.85fr] lg:items-start"><RecentTransactions :transactions="transactions" /><ProportionIncomeExpenses :proportions="proportions" /></div></main></div>
</template>
