<script setup lang="ts">
import { computed } from 'vue'
import { ArcElement, Chart as ChartJS, Legend, Tooltip, type ChartOptions } from 'chart.js'
import Card from 'primevue/card'
import { Doughnut } from 'vue-chartjs'
import type { ExpenseProportion } from '../types/dashboard.types'

ChartJS.register(ArcElement, Tooltip, Legend)

interface Props { proportions: ExpenseProportion[] }
const props = defineProps<Props>()

const chartData = computed(() => ({
  labels: props.proportions.map((item) => item.label),
  datasets: [{
    data: props.proportions.map((item) => item.value),
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
    <template #title><h2 class="m-0 text-xl font-bold text-slate-800">Proporsi pengeluaran</h2></template>
    <template #content>
      <div class="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div class="relative size-40 shrink-0"><Doughnut :data="chartData" :options="chartOptions" /></div>
        <div class="grid w-full gap-3">
          <div v-for="item in proportions" :key="item.label" class="flex items-center justify-between gap-3 text-sm"><span class="flex items-center gap-2 text-slate-500"><span class="size-2.5 rounded-full" :class="item.colorClass"></span>{{ item.label }}</span><strong class="text-slate-700">{{ item.value }}%</strong></div>
        </div>
      </div>
    </template>
  </Card>
</template>
