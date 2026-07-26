<script setup lang="ts">
import Button from 'primevue/button'
import Card from 'primevue/card'
import { useRouter } from 'vue-router'
import type { RecentTransaction } from '../types/dashboard.types'

interface Props { transactions: RecentTransaction[] }
defineProps<Props>()
const router = useRouter()
</script>

<template>
  <Card class="rounded-2xl! border! border-slate-200! shadow-sm!">
    <template #title><div class="flex items-center justify-between gap-3"><h2 class="m-0 text-xl font-bold text-slate-800">Transaksi terbaru</h2><Button label="Lihat semua" text size="small" class="text-brand-700!" @click="router.push({ name: 'transactions.list' })" /></div></template>
    <template #content>
      <div class="divide-y divide-slate-100">
        <div v-for="transaction in transactions" :key="transaction.id" class="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
          <span class="grid size-10 shrink-0 place-items-center rounded-xl" :class="transaction.iconClass"><i :class="['pi', transaction.icon]"></i></span>
          <div class="min-w-0 flex-1"><p class="truncate text-sm font-semibold text-slate-700">{{ transaction.merchant }}</p><p class="mt-0.5 text-xs text-slate-400">{{ transaction.category }} · {{ transaction.date }}</p></div>
          <span class="shrink-0 text-sm font-bold" :class="transaction.type === 'income' ? 'text-emerald-600' : 'text-slate-700'">{{ transaction.type === 'income' ? '+' : '-' }}{{ transaction.amount }}</span>
        </div>
      </div>
    </template>
  </Card>
</template>
