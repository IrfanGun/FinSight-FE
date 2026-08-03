<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { createCategory, createTransaction, listCategories, type TransactionCategory, type TransactionType } from '@/modules/transactions'
import AssetOverview from '../components/AssetOverview.vue'
import CashflowSummary from '../components/CashflowSummary.vue'
import CategoryModal from '../components/CategoryModal.vue'
import DashboardHeader from '../components/DashboardHeader.vue'
import ProportionIncomeExpenses from '../components/ProportionIncomeExpenses.vue'
import RecentTransactions from '../components/RecentTransactions.vue'
import TransactionModal from '../components/TransactionModal.vue'
import { DASHBOARD_ASSETS } from '../constants/dashboard.constants'
import { useAssetAccounts } from '../composables/useAssetAccounts'
import { useProportions } from '../composables/useProportions'
import { useRecentTransactions } from '../composables/useRecentTransactions'
import { useTransactionSummary } from '../composables/useTransactionSummary'
import type { AssetSummary } from '../types/dashboard.types'

const localDate = (): string => {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10)
}

const currencyFormatter = new Intl.NumberFormat('id-ID')
const formatCurrency = (amount: number): string => `Rp ${currencyFormatter.format(amount)}`
const router = useRouter()
const authStore = useAuthStore()
const userId = computed(() => authStore.currentUser?.id)
const userName = computed(() => authStore.currentUser?.fullName ?? 'Pengguna')
const dateFrom = ref('')
const dateTo = ref('')
const { transactions, fetchRecentTransactions } = useRecentTransactions(() => userId.value, dateFrom, dateTo)
const { accounts, fetchAccounts } = useAssetAccounts(userId)
const { summary, refreshSummary } = useTransactionSummary(userId, dateTo)
const { proportions } = useProportions(userId)
const cashflow = computed(() => ({ income: formatCurrency(summary.value?.income ?? 0), expense: formatCurrency(summary.value?.expense ?? 0), incomeChange: '', expenseChange: '' }))
const assets = computed<AssetSummary[]>(() => {
  const balances = accounts.value.reduce((result, account) => {
    result.set(account.type, (result.get(account.type) ?? 0) + account.balance)
    return result
  }, new Map<string, number>())
  const counts = accounts.value.reduce((result, account) => {
    result.set(account.type, (result.get(account.type) ?? 0) + 1)
    return result
  }, new Map<string, number>())
  return DASHBOARD_ASSETS.map((asset) => ({
    ...asset,
    amount: formatCurrency(balances.get(asset.type) ?? 0),
    detail: `${counts.get(asset.type) ?? 0} akun`,
  }))
})
const modal = ref<'transaction' | 'category' | null>(null)
const categories = ref<TransactionCategory[]>([])
const modalError = ref('')
const transactionForm = ref({ type: 'income' as TransactionType, amount: '', transaction_date: localDate(), category_id: '', from_account_id: '', description: '' })
const categoryForm = ref({ name: '', type: 'income' as TransactionType })

async function refreshDashboard(): Promise<void> {
  await Promise.all([refreshSummary(), fetchRecentTransactions(), fetchAccounts()])
}

async function openTransactionModal(): Promise<void> {
  modalError.value = ''
  try {
    categories.value = await listCategories()
    modal.value = 'transaction'
  } catch {
    modalError.value = 'Kategori gagal dimuat.'
    modal.value = 'transaction'
  }
}

async function saveTransaction(payload: { form: typeof transactionForm.value }): Promise<void> {
  const form = payload.form
  if (!userId.value || !form.amount || !form.category_id || !form.from_account_id) {
    modalError.value = 'Pilih akun, kategori, dan isi nominal.'
    return
  }
  try {
    await createTransaction({ user_id: userId.value, type: form.type, amount: Number(form.amount), transaction_date: form.transaction_date, category_id: Number(form.category_id), from_account_id: Number(form.from_account_id), description: form.description })
    modal.value = null
    await refreshDashboard()
  } catch {
    modalError.value = 'Transaksi gagal disimpan.'
  }
}

async function saveCategory(payload: { name: string; type: TransactionType }): Promise<void> {
  if (!payload.name.trim()) return
  try {
    categories.value.push(await createCategory(payload))
    modal.value = null
  } catch {
    modalError.value = 'Kategori gagal disimpan.'
  }
}

function handleDateFilter(filter: { key: 'from' | 'to'; value: string }): void {
  if (filter.key === 'from') dateFrom.value = filter.value
  else dateTo.value = filter.value
}

function handleSignOut(): void {
  authStore.signOut()
  void router.push({ name: 'auth.login' })
}
</script>

<template>
  <div class="min-h-screen bg-[#f7faf9]">
    <DashboardHeader :user-name="userName" @sign-out="handleSignOut" @date-filter="handleDateFilter" />
    <main class="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:px-12">
      <header class="flex flex-wrap items-end justify-between gap-4"><div><p class="mb-1 text-sm font-semibold text-brand-700">Dashboard</p><h1 class="text-2xl font-bold text-slate-800 sm:text-3xl">Ringkasan keuangan</h1><p class="mt-2 text-sm text-slate-500">Pantau kondisi keuangan Anda hari ini.</p></div><div class="flex gap-2"><button class="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white" @click="openTransactionModal">Tambah transaksi</button><button class="rounded-lg border border-brand-700 px-4 py-2 text-sm font-semibold text-brand-700" @click="modal = 'category'; modalError = ''">Tambah kategori</button></div></header>
      <AssetOverview :assets="assets" />
      <CashflowSummary :summary="cashflow" />
      <div class="grid gap-6 lg:grid-cols-[1.15fr_.85fr] lg:items-start"><RecentTransactions :transactions="transactions" /><ProportionIncomeExpenses :proportions="proportions" /></div>
    </main>
    <TransactionModal v-if="modal === 'transaction'" v-model="transactionForm" :categories="categories" :accounts="accounts" :error="modalError" @close="modal = null" @saved="saveTransaction" />
    <CategoryModal v-if="modal === 'category'" v-model="categoryForm" :error="modalError" @close="modal = null" @saved="saveCategory" />
  </div>
</template>
