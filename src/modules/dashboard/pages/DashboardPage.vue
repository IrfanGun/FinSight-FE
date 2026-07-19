<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/modules/auth/stores/auth.store'
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
const recentTransactions: RecentTransaction[] = [
  { id: 1, merchant: 'Gaji Bulanan', category: 'Pemasukan', date: '30 Jun 2026', amount: 'Rp 12.500.000', type: 'income', icon: 'pi-arrow-down-left', iconClass: 'bg-emerald-100 text-emerald-700' },
  { id: 2, merchant: 'Superindo', category: 'Kebutuhan', date: '29 Jun 2026', amount: 'Rp 485.000', type: 'expense', icon: 'pi-shopping-cart', iconClass: 'bg-orange-100 text-orange-700' },
  { id: 3, merchant: 'Spotify', category: 'Lifestyle', date: '28 Jun 2026', amount: 'Rp 54.990', type: 'expense', icon: 'pi-music', iconClass: 'bg-violet-100 text-violet-700' },
  { id: 4, merchant: 'Transport Online', category: 'Transportasi', date: '27 Jun 2026', amount: 'Rp 32.000', type: 'expense', icon: 'pi-car', iconClass: 'bg-blue-100 text-blue-700' },
]

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
