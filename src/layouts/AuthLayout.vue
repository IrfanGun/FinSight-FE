<script setup lang="ts">
interface Props {
  title: string
  description: string
}

defineProps<Props>()
</script>

<template>
  <main class="min-h-screen w-full bg-[#fbfdfc]">
    <section class="mx-auto flex min-h-screen w-full max-w-xl flex-col items-stretch justify-center px-5 py-8 sm:px-10 md:px-16">
      <div class="mx-auto mb-12 flex items-center gap-3 text-xl font-bold tracking-tight text-[#153c35] md:hidden">
        <span class="grid size-10 place-items-center rounded-md bg-brand-100 text-brand-700">
          <i class="pi pi-chart-line"></i>
        </span>
        <span>FinSight<span class="text-brand-500">AI</span></span>
      </div>
      <slot />
    </section>
  </main>
</template>
