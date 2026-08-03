<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { createTransaction, deleteTransaction, listTransactions, updateTransaction } from '../api/transaction.api'
import { createCategory, deleteCategory, listCategories, updateCategory } from '../api/category.api'
import type { TransactionCategory } from '../api/category.api'
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
const categories = ref<TransactionCategory[]>([])
const showTransactionForm = ref(false)
const showCategoryForm = ref(false)
const editingId = ref<number | null>(null)
const form = ref({ type: 'income' as TransactionType, amount: '', transaction_date: new Date().toISOString().slice(0, 10), category_id: '', from_account_id: '', description: '' })
const categoryForm = ref({ name: '', type: 'income' as TransactionType })
const editingCategoryId = ref<number | null>(null)

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
onMounted(async () => { try { categories.value = await listCategories() } catch { errorMessage.value = 'Kategori gagal dimuat.' } })

function resetForm(): void { editingId.value = null; form.value = { type: 'income', amount: '', transaction_date: new Date().toISOString().slice(0, 10), category_id: '', from_account_id: '', description: '' }; showTransactionForm.value = true }
function editTransaction(item: Transaction): void { editingId.value = item.id; form.value = { type: item.type, amount: item.amount, transaction_date: item.transaction_date, category_id: String(item.category_id), from_account_id: String(item.from_account_id), description: '' }; showTransactionForm.value = true }
async function saveTransaction(): Promise<void> { const userId = authStore.currentUser?.id; if (!userId || !form.value.amount || !form.value.category_id || !form.value.from_account_id) return; const payload = { type: form.value.type, amount: Number(form.value.amount), transaction_date: form.value.transaction_date, category_id: Number(form.value.category_id), from_account_id: Number(form.value.from_account_id), description: form.value.description }; try { if (editingId.value) await updateTransaction(editingId.value, userId, payload); else await createTransaction({ user_id: userId, ...payload }); showTransactionForm.value = false; await loadTransactions() } catch { errorMessage.value = 'Transaksi gagal disimpan.' } }
async function removeTransaction(item: Transaction): Promise<void> { const userId = authStore.currentUser?.id; if (!userId || !window.confirm('Hapus transaksi ini?')) return; try { await deleteTransaction(item.id, userId); await loadTransactions() } catch { errorMessage.value = 'Transaksi gagal dihapus.' } }
function editCategory(category: TransactionCategory): void { editingCategoryId.value = category.id; categoryForm.value = { name: category.name, type: category.type }; showCategoryForm.value = true }
async function saveCategory(): Promise<void> { if (!categoryForm.value.name.trim()) return; try { if (editingCategoryId.value) { const category = await updateCategory(editingCategoryId.value, categoryForm.value); categories.value = categories.value.map((item) => item.id === category.id ? category : item) } else { const category = await createCategory(categoryForm.value); categories.value.push(category) }; editingCategoryId.value = null; categoryForm.value = { name: '', type: 'income' }; showCategoryForm.value = false } catch { errorMessage.value = 'Kategori gagal disimpan.' } }
async function removeCategory(category: TransactionCategory): Promise<void> { if (!window.confirm('Hapus kategori ini?')) return; try { await deleteCategory(category.id); categories.value = categories.value.filter((item) => item.id !== category.id) } catch { errorMessage.value = 'Kategori gagal dihapus.' } }
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
      <div class="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p class="text-sm text-slate-500">Riwayat keuangan</p><h2 class="text-2xl font-bold text-slate-800">Semua transaksi</h2></div><div class="flex gap-2"><button class="rounded-lg bg-brand-700 px-3 py-2 text-sm font-semibold text-white" @click="resetForm">Tambah transaksi</button><button class="rounded-lg border border-brand-700 px-3 py-2 text-sm font-semibold text-brand-700" @click="showCategoryForm = true">Tambah kategori</button><select v-model="selectedType" class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" @change="changeFilter"><option value="">Semua tipe</option><option value="income">Pemasukan</option><option value="expense">Pengeluaran</option></select></div></div>
      <div v-if="showTransactionForm" class="mb-5 grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2"><select v-model="form.type" class="rounded-lg border p-2"><option value="income">Pemasukan</option><option value="expense">Pengeluaran</option></select><input v-model="form.amount" type="number" min="1" placeholder="Nominal" class="rounded-lg border p-2"><input v-model="form.transaction_date" type="date" class="rounded-lg border p-2"><input v-model="form.from_account_id" type="number" placeholder="ID akun" class="rounded-lg border p-2"><select v-model="form.category_id" class="rounded-lg border p-2"><option value="">Pilih kategori</option><option v-for="category in categories.filter((item) => item.type === form.type)" :key="category.id" :value="category.id">{{ category.name }}</option></select><input v-model="form.description" placeholder="Deskripsi (opsional)" class="rounded-lg border p-2"><div class="flex gap-2 sm:col-span-2"><button class="rounded-lg bg-brand-700 px-4 py-2 text-sm text-white" @click="saveTransaction">Simpan</button><button class="rounded-lg border px-4 py-2 text-sm" @click="showTransactionForm = false">Batal</button></div></div>
      <div v-if="showCategoryForm" class="mb-5 flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><input v-model="categoryForm.name" placeholder="Nama kategori" class="rounded-lg border p-2"><select v-model="categoryForm.type" class="rounded-lg border p-2"><option value="income">Pemasukan</option><option value="expense">Pengeluaran</option></select><button class="rounded-lg bg-brand-700 px-4 py-2 text-sm text-white" @click="saveCategory">{{ editingCategoryId ? 'Update kategori' : 'Simpan kategori' }}</button><button class="rounded-lg border px-4 py-2 text-sm" @click="showCategoryForm = false; editingCategoryId = null">Batal</button></div>
      <div v-if="categories.length" class="mb-5 flex flex-wrap gap-2"><span v-for="category in categories" :key="category.id" class="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-xs"><span>{{ category.name }} · {{ category.type === 'income' ? 'Pemasukan' : 'Pengeluaran' }}</span><button class="text-brand-700" @click="editCategory(category)">Edit</button><button class="text-red-600" @click="removeCategory(category)">Hapus</button></span></div>
      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div v-if="loading" class="p-8 text-center text-sm text-slate-500">Memuat transaksi...</div>
        <div v-else-if="errorMessage" class="p-8 text-center text-sm text-red-600">{{ errorMessage }} <button class="font-semibold underline" @click="loadTransactions">Coba lagi</button></div>
        <div v-else-if="!transactions.length" class="p-8 text-center text-sm text-slate-500">Belum ada transaksi.</div>
        <table v-else class="w-full text-left text-sm"><thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500"><tr><th class="px-5 py-3">Tanggal</th><th class="px-5 py-3">Akun</th><th class="px-5 py-3">Kategori</th><th class="px-5 py-3 text-right">Nominal</th><th class="px-5 py-3">Aksi</th></tr></thead><tbody><tr v-for="transaction in transactions" :key="transaction.id" class="border-b border-slate-100 last:border-0"><td class="px-5 py-4 text-slate-600">{{ transaction.transaction_date }}</td><td class="px-5 py-4 font-medium text-slate-700">{{ transaction.from_account_name }}</td><td class="px-5 py-4 text-slate-600">{{ transaction.category_name }}</td><td class="px-5 py-4 text-right font-semibold" :class="transaction.type === 'income' ? 'text-emerald-600' : 'text-slate-700'">{{ transaction.type === 'income' ? '+' : '-' }} {{ formatAmount(transaction.amount) }}</td><td class="px-5 py-4"><button class="mr-2 text-brand-700" @click="editTransaction(transaction)">Edit</button><button class="text-red-600" @click="removeTransaction(transaction)">Hapus</button></td></tr></tbody></table>
        <div class="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-sm text-slate-500"><span>Halaman {{ page }} dari {{ totalPages }}</span><div class="flex gap-2"><button class="rounded border px-3 py-1 disabled:opacity-40" :disabled="page <= 1 || loading" @click="page--; loadTransactions()">Sebelumnya</button><button class="rounded border px-3 py-1 disabled:opacity-40" :disabled="page >= totalPages || loading" @click="page++; loadTransactions()">Berikutnya</button></div></div>
      </div>
    </main>
  </div>
</template>
