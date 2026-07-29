<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Message from 'primevue/message'

import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { useChat } from '../composables/useChat'

const router = useRouter()
const authStore = useAuthStore()
const userName = computed(() => authStore.currentUser?.fullName ?? 'Pengguna')
const { input, isLoading, errorMessage, messages, handleSend } = useChat()

function handleSignOut(): void {
  authStore.signOut()
  void router.push({ name: 'auth.login' })
}
</script>

<template>
  <div class="min-h-screen bg-[#f7faf9]">
    <header class="flex items-center justify-between gap-4 border-b border-slate-200/80 bg-white px-5 py-4 sm:px-8 lg:px-12">
      <RouterLink class="flex items-center gap-2.5 text-lg font-bold tracking-tight text-[#153c35] no-underline" to="/dashboard">
        <span class="grid size-9 place-items-center rounded-lg bg-brand-100 text-brand-700"><i class="pi pi-chart-line" /></span>
        <span>FinSight<span class="text-brand-500">AI</span></span>
      </RouterLink>
      <div class="flex items-center gap-3">
        <span class="hidden text-sm text-slate-500 sm:inline">Halo, {{ userName }}</span>
        <Button aria-label="Keluar" icon="pi pi-sign-out" severity="secondary" text rounded @click="handleSignOut" />
      </div>
    </header>

    <main class="mx-auto flex max-w-4xl flex-col gap-6 px-5 py-8 sm:px-8">
      <header>
        <p class="mb-1 text-sm font-semibold text-brand-700">Chat</p>
        <h1 class="m-0 text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">Tanya FinSight AI</h1>
        <p class="mt-2 text-sm text-slate-500">Dapatkan insight dan bantuan mengelola keuangan Anda.</p>
      </header>

      <section class="flex min-h-[28rem] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="flex-1 space-y-4 overflow-y-auto p-5 sm:p-7">
          <div v-for="message in messages" :key="message.id" class="flex" :class="message.role === 'user' ? 'justify-end' : 'justify-start'">
            <div class="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed" :class="message.role === 'user' ? 'rounded-br-md bg-brand-700 text-white' : 'rounded-bl-md bg-slate-100 text-slate-700'">
              {{ message.content }}
            </div>
          </div>
          <div v-if="isLoading" class="flex justify-start"><div class="rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 text-sm text-slate-500">FinSight AI sedang mengetik…</div></div>
        </div>
        <Message v-if="errorMessage" class="mx-5 mb-3" severity="error" :closable="false">{{ errorMessage }}</Message>
        <form class="flex gap-3 border-t border-slate-100 p-4 sm:p-5" @submit.prevent="handleSend">
          <input v-model="input" class="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100" :disabled="isLoading" placeholder="Contoh: Berapa pengeluaran saya bulan ini?" aria-label="Pesan chat" />
          <Button type="submit" label="Kirim" icon="pi pi-send" :loading="isLoading" :disabled="!input.trim()" />
        </form>
      </section>
    </main>
  </div>
</template>
