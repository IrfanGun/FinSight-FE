<script setup lang="ts">
import Button from 'primevue/button'

interface Props {
  userName: string
}

defineProps<Props>()

const emit = defineEmits<{ signOut: [] }>()
</script>

<template>
  <header class="flex items-center justify-between gap-4 border-b border-slate-200/80 bg-white px-5 py-4 sm:px-8 lg:px-12">
    <a class="flex items-center gap-2.5 text-lg font-bold tracking-tight text-[#153c35] no-underline" href="/dashboard">
      <span class="grid size-9 place-items-center rounded-lg bg-brand-100 text-brand-700"><i class="pi pi-chart-line"></i></span>
      <span>FinSight<span class="text-brand-500">AI</span></span>
    </a>
    <div class="flex items-center gap-3">
      <span class="hidden text-sm text-slate-500 sm:inline">Halo, {{ userName }}</span>
      <Button aria-label="Keluar" icon="pi pi-sign-out" severity="secondary" text rounded @click="emit('signOut')" />
    </div>
  </header>
</template>
