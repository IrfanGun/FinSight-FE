<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Card from 'primevue/card'
import type { CashflowSummary } from '../types/dashboard.types'

interface Props { summary: CashflowSummary }
defineProps<Props>()
const periodLabel = ref('bulan ini')
function updatePeriod(event: Event): void {
  const value = (event as CustomEvent<{ value: string }>).detail.value
  if (!value) return
  periodLabel.value = new Date(`${value}T00:00:00`).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
}
onMounted(() => window.addEventListener('dashboard-date-filter', updatePeriod))
onBeforeUnmount(() => window.removeEventListener('dashboard-date-filter', updatePeriod))
</script>

<template>
  <section aria-labelledby="cashflow-heading"><h2 id="cashflow-heading" class="mb-4 text-xl font-bold text-slate-800">Arus kas</h2><div class="grid gap-4 sm:grid-cols-2"><Card class="rounded-2xl! border! border-emerald-100! bg-emerald-50/60! shadow-sm!"><template #content><div class="flex items-start justify-between"><div><p class="mb-2 text-sm text-emerald-800">Pemasukan</p><p class="m-0 text-2xl font-bold text-emerald-950">{{ summary.income }}</p><p class="mt-2 text-xs font-medium text-emerald-700"><i class="pi pi-arrow-up-right mr-1"></i>{{ summary.incomeChange }} {{ periodLabel }}</p></div><span class="grid size-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700"><i class="pi pi-arrow-down-left"></i></span></div></template></Card><Card class="rounded-2xl! border! border-rose-100! bg-rose-50/60! shadow-sm!"><template #content><div class="flex items-start justify-between"><div><p class="mb-2 text-sm text-rose-800">Pengeluaran</p><p class="m-0 text-2xl font-bold text-rose-950">{{ summary.expense }}</p><p class="mt-2 text-xs font-medium text-rose-700"><i class="pi pi-arrow-up-right mr-1"></i>{{ summary.expenseChange }} {{ periodLabel }}</p></div><span class="grid size-10 place-items-center rounded-xl bg-rose-100 text-rose-700"><i class="pi pi-arrow-up-right"></i></span></div></template></Card></div></section>
</template>
