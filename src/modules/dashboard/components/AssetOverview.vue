<script setup lang="ts">
import Card from 'primevue/card'
import type { AssetSummary } from '../types/dashboard.types'

interface Props { assets: AssetSummary[] }
defineProps<Props>()
</script>

<template>
  <section aria-labelledby="assets-heading">
    <div class="mb-4 flex items-end justify-between gap-4">
      <div><p class="mb-1 text-xs font-semibold tracking-wider text-brand-700 uppercase">Ringkasan</p><h2 id="assets-heading" class="m-0 text-xl font-bold text-slate-800">Total aset</h2></div>
      <span class="text-sm text-slate-500">Juni 2026</span>
    </div>
    <div class="grid gap-4 sm:grid-cols-3">
      <Card v-for="asset in assets" :key="asset.type" class="rounded-2xl! border! border-slate-200! shadow-sm!">
        <template #content>
          <div class="flex items-start justify-between gap-3">
            <div><p class="mb-2 text-sm text-slate-500">{{ asset.label }}</p><p class="m-0 text-xl font-bold tracking-tight text-slate-800">{{ asset.amount }}</p><p class="mt-2 text-xs text-slate-400">{{ asset.detail }}</p></div>
            <span class="grid size-10 place-items-center rounded-xl" :class="asset.accentClass"><i :class="['pi', asset.icon]"></i></span>
          </div>
        </template>
      </Card>
    </div>
  </section>
</template>
