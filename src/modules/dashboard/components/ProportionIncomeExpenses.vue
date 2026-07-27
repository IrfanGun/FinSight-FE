<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArcElement, Chart as ChartJS, Legend, Tooltip, type ChartOptions } from 'chart.js'
import Card from 'primevue/card'
import { Doughnut } from 'vue-chartjs'
import type { Proportion } from '../api/proportion.api'

ChartJS.register(ArcElement, Tooltip, Legend)

interface Props { proportions: Record<'expenses' | 'incomes' | 'assets', Proportion[]> }
const props = defineProps<Props>()
const selected = ref<'expenses' | 'incomes' | 'assets'>('expenses')
const current = computed(() => props.proportions[selected.value])

const chartData = computed(() => ({
  labels: current.value.map((item) => item.label),
  datasets: [{
    data: current.value.map((item) => item.percentage),
    backgroundColor: ['#0d6d58', '#49c7a1', '#f5b84b', '#e6edf0'],
    borderWidth: 0,
    hoverOffset: 4,
  }],
}))

const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context) => ` ${context.label}: ${context.parsed}%`,
      },
    },
  },
}
</script>

<template>
  <Card class="rounded-2xl! border! border-slate-200! shadow-sm!">
    <template #title><div class="flex flex-wrap gap-2"><button v-for="tab in [{ key: 'incomes', label: 'Pemasukan' }, { key: 'expenses', label: 'Pengeluaran' }, { key: 'assets', label: 'Asset' }]" :key="tab.key" class="rounded-lg px-3 py-1.5 text-sm" :class="selected === tab.key ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-600'" @click="selected = tab.key as typeof selected">{{ tab.label }}</button></div></template>
    <template #content>
      <div class="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div class="relative size-40 shrink-0"><Doughnut :data="chartData" :options="chartOptions" /></div>
        <div class="grid w-full gap-3">
          <div v-for="(item, index) in current" :key="item.label" class="flex items-center justify-between gap-3 text-sm"><span class="flex items-center gap-2 text-slate-500"><span class="size-2.5 rounded-full" :class="['bg-brand-700', 'bg-brand-400', 'bg-amber-400', 'bg-slate-300'][index % 4]"></span>{{ item.label }}</span><strong class="text-slate-700">{{ item.percentage }}%</strong></div>
        </div>
      </div>
    </template>
  </Card>
</template>
