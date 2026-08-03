<script setup lang="ts">
import Button from 'primevue/button'

interface Props {
  userName: string
}

defineProps<Props>()

const emit = defineEmits<{
  signOut: []
  dateFilter: [{ key: 'from' | 'to'; value: string }]
}>()
function changeDateFilter(event: Event, key: 'from' | 'to'): void {
  emit('dateFilter', { key, value: (event.target as HTMLInputElement).value })
}
</script>

<template>
  <header class="flex items-center justify-between gap-4 border-b border-slate-200/80 bg-white px-5 py-4 sm:px-8 lg:px-12">
    <a class="flex items-center gap-2.5 text-lg font-bold tracking-tight text-[#153c35] no-underline" href="/dashboard">
      <span class="grid size-9 place-items-center rounded-lg bg-brand-100 text-brand-700"><i class="pi pi-chart-line"></i></span>
      <span>FinSight<span class="text-brand-500">AI</span></span>
    </a>
    <div class="flex items-center gap-3">
      <label class="hidden items-center gap-1 text-xs text-slate-500 md:flex">Dari <input type="date" class="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700" @change="changeDateFilter($event, 'from')" /></label>
      <label class="hidden items-center gap-1 text-xs text-slate-500 md:flex">Sampai <input type="date" class="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700" @change="changeDateFilter($event, 'to')" /></label>
      <span class="hidden text-sm text-slate-500 sm:inline">Halo, {{ userName }}</span>
      <Button label="Chat" icon="pi pi-comments" size="small" @click="$router.push({ name: 'chat' })" />
      <Button aria-label="Keluar" icon="pi pi-sign-out" severity="secondary" text rounded @click="emit('signOut')" />
    </div>
  </header>
</template>
