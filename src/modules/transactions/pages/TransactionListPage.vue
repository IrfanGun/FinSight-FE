<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { listTransactions } from '../api/transaction.api'
import type { Transaction, TransactionType } from '../types/transaction.types'

const router = useRouter()
const authStore = useAuthStore()
const transactions = ref<Transaction[]>([])
const selectedType = ref<TransactionType | ''>('')
const page = ref(1)
const pageSize = 10
const total = ref(0)
const loading = ref(false)
const errorMessage = ref('')

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))

async function loadTransactions(): Promise<void> {
  const userId = authStore.currentUser?.id
  if (!userId) return

  loading.value = true
  errorMessage.value = ''
  try {
    const response = await listTransactions({
      user_id: userId,
      page: page.value,
      page_size: pageSize,
      ...(selectedType.value ? { type: selectedType.value } : {}),
    })
    transactions.value = response.items
    total.value = response.total
  } catch {
    errorMessage.value = 'Transaksi gagal dimuat. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}

function formatAmount(amount: string): string {
  return `Rp ${new Intl.NumberFormat('id-ID').format(Number(amount))}`
}

function changeFilter(): void {
  page.value = 1
  void loadTransactions()
}

function signOut(): void {
  authStore.signOut()
  void router.push({ name: 'auth.login' })
}

onMounted(() => void loadTransactions())
</script>

<template>
  <div class="min-h-screen bg-[#f7faf9]">
    <header class="border-b border-slate-200 bg-white">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        <div><p class="text-sm font-semibold text-brand-700">FinSight AI</p><h1 class="text-xl font-bold text-slate-800">Daftar transaksi</h1></div>
        <div class="flex items-center gap-3"><button class="text-sm font-medium text-slate-500 hover:text-slate-800" @click="router.push({ name: 'dashboard' })">Dashboard</button><button class="text-sm font-medium text-red-600" @click="signOut">Keluar</button></div>
      </div>
    </header>
    <main class="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12">
      <div class="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p class="text-sm text-slate-500">Riwayat keuangan</p><h2 class="text-2xl font-bold text-slate-800">Semua transaksi</h2></div><select v-model="selectedType" class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" @change="changeFilter"><option value="">Semua tipe</option><option value="income">Pemasukan</option><option value="expense">Pengeluaran</option></select></div>
      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div v-if="loading" class="p-8 text-center text-sm text-slate-500">Memuat transaksi...</div>
        <div v-else-if="errorMessage" class="p-8 text-center text-sm text-red-600">{{ errorMessage }} <button class="font-semibold underline" @click="loadTransactions">Coba lagi</button></div>
        <div v-else-if="!transactions.length" class="p-8 text-center text-sm text-slate-500">Belum ada transaksi.</div>
        <table v-else class="w-full text-left text-sm"><thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500"><tr><th class="px-5 py-3">Tanggal</th><th class="px-5 py-3">Akun</th><th class="px-5 py-3">Kategori</th><th class="px-5 py-3 text-right">Nominal</th></tr></thead><tbody><tr v-for="transaction in transactions" :key="transaction.id" class="border-b border-slate-100 last:border-0"><td class="px-5 py-4 text-slate-600">{{ transaction.transaction_date }}</td><td class="px-5 py-4 font-medium text-slate-700">{{ transaction.from_account_name }}</td><td class="px-5 py-4 text-slate-600">{{ transaction.category_name }}</td><td class="px-5 py-4 text-right font-semibold" :class="transaction.type === 'income' ? 'text-emerald-600' : 'text-slate-700'">{{ transaction.type === 'income' ? '+' : '-' }} {{ formatAmount(transaction.amount) }}</td></tr></tbody></table>
        <div class="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-sm text-slate-500"><span>Halaman {{ page }} dari {{ totalPages }}</span><div class="flex gap-2"><button class="rounded border px-3 py-1 disabled:opacity-40" :disabled="page <= 1 || loading" @click="page--; loadTransactions()">Sebelumnya</button><button class="rounded border px-3 py-1 disabled:opacity-40" :disabled="page >= totalPages || loading" @click="page++; loadTransactions()">Berikutnya</button></div></div>
      </div>
    </main>
  </div>
</template>
