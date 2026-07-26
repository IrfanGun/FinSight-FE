<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import AssetOverview from '../components/AssetOverview.vue'
import CashflowSummary from '../components/CashflowSummary.vue'
import DashboardHeader from '../components/DashboardHeader.vue'
import ProportionIncomeExpenses from '../components/ProportionIncomeExpenses.vue'
import RecentTransactions from '../components/RecentTransactions.vue'
import { DASHBOARD_ASSETS, DASHBOARD_CASHFLOW, DASHBOARD_PROPORTIONS } from '../constants/dashboard.constants'
import { useRecentTransactions } from '../composables/useRecentTransactions'

const router = useRouter()
const authStore = useAuthStore()
const userName = computed(() => authStore.currentUser?.fullName ?? 'Pengguna')
const { transactions } = useRecentTransactions(() => authStore.currentUser?.id)

function handleSignOut(): void { authStore.signOut(); void router.push({ name: 'auth.login' }) }
</script>

<template>
  <div class="min-h-screen bg-[#f7faf9]"><DashboardHeader :user-name="userName" @sign-out="handleSignOut" /><main class="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:px-12"><header><p class="mb-1 text-sm font-semibold text-brand-700">Dashboard</p><h1 class="m-0 text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">Ringkasan keuangan</h1><p class="mt-2 text-sm text-slate-500">Pantau kondisi keuangan Anda hari ini.</p></header><AssetOverview :assets="DASHBOARD_ASSETS" /><CashflowSummary :summary="DASHBOARD_CASHFLOW" /><div class="grid gap-6 lg:grid-cols-[1.15fr_.85fr] lg:items-start"><RecentTransactions :transactions="transactions" /><ProportionIncomeExpenses :proportions="DASHBOARD_PROPORTIONS" /></div></main></div>
</template>
