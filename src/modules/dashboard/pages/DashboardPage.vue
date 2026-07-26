<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { listTransactions } from '@/modules/transactions'
import type { Transaction } from '@/modules/transactions'
import AssetOverview from '../components/AssetOverview.vue'
import CashflowSummary from '../components/CashflowSummary.vue'
import DashboardHeader from '../components/DashboardHeader.vue'
import ProportionIncomeExpenses from '../components/ProportionIncomeExpenses.vue'
import RecentTransactions from '../components/RecentTransactions.vue'
import type { AssetSummary, CashflowSummary as CashflowSummaryData, ExpenseProportion, RecentTransaction } from '../types/dashboard.types'

const router = useRouter()
const authStore = useAuthStore()
const userName = computed(() => authStore.currentUser?.fullName ?? 'Pengguna')

const assets: AssetSummary[] = [
  { type: 'wallet', label: 'Wallet', amount: 'Rp 4.250.000', detail: 'Uang tunai', icon: 'pi-wallet', accentClass: 'bg-amber-100 text-amber-700' },
  { type: 'bank', label: 'Bank', amount: 'Rp 18.750.000', detail: '2 rekening', icon: 'pi-building-columns', accentClass: 'bg-blue-100 text-blue-700' },
  { type: 'investment', label: 'Investment', amount: 'Rp 32.500.000', detail: '3 portofolio', icon: 'pi-chart-line', accentClass: 'bg-brand-100 text-brand-700' },
]

const cashflow: CashflowSummaryData = { income: 'Rp 12.500.000', expense: 'Rp 7.850.000', incomeChange: '+12,4%', expenseChange: '+4,8%' }
const proportions: ExpenseProportion[] = [
  { label: 'Kebutuhan', value: 38, colorClass: 'bg-brand-700' },
  { label: 'Lifestyle', value: 25, colorClass: 'bg-brand-400' },
  { label: 'Transportasi', value: 18, colorClass: 'bg-amber-400' },
  { label: 'Lainnya', value: 19, colorClass: 'bg-slate-200' },
]
const recentTransactions = ref<RecentTransaction[]>([])

function mapTransaction(transaction: Transaction): RecentTransaction {
  const type = transaction.type
  return {
    id: transaction.id,
    merchant: transaction.from_account_name,
    category: transaction.category_name,
    date: transaction.transaction_date,
    amount: new Intl.NumberFormat('id-ID').format(Number(transaction.amount)),
    type,
    icon: type === 'income' ? 'pi-arrow-down-left' : 'pi-shopping-cart',
    iconClass: type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700',
  }
}

onMounted(async () => {
  const userId = authStore.currentUser?.id
  if (!userId) return

  try {
    const response = await listTransactions({ user_id: userId, page: 1, page_size: 5 })
    recentTransactions.value = [...response.items]
      .sort((left, right) => right.transaction_date.localeCompare(left.transaction_date))
      .slice(0, 5)
      .map(mapTransaction)
  } catch {
    recentTransactions.value = []
  }
})

function handleSignOut(): void {
  authStore.signOut()
  void router.push({ name: 'auth.login' })
}
</script>

<template>
  <div class="min-h-screen bg-[#f7faf9]">
    <DashboardHeader :user-name="userName" @sign-out="handleSignOut" />
    <main class="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:px-12">
      <header><p class="mb-1 text-sm font-semibold text-brand-700">Dashboard</p><h1 class="m-0 text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">Ringkasan keuangan</h1><p class="mt-2 text-sm text-slate-500">Pantau kondisi keuangan Anda hari ini.</p></header>
      <AssetOverview :assets="assets" />
      <CashflowSummary :summary="cashflow" />
      <div class="grid gap-6 lg:grid-cols-[1.15fr_.85fr] lg:items-start"><RecentTransactions :transactions="recentTransactions" /><ProportionIncomeExpenses :proportions="proportions" /></div>
    </main>
  </div>
</template>
