<script setup lang="ts">
import { ref } from 'vue'

import AuthLayout from '@/layouts/AuthLayout.vue'
import LoginForm from '../components/LoginForm.vue'
import type { LoginFormValues } from '../types/auth.types'

const errorMessage = ref('')

function handleLogin(_values: LoginFormValues): void {
  errorMessage.value = 'Login belum terhubung ke API.'
}
</script>

<template>
  <AuthLayout
    title="Keuangan yang lebih mudah dipahami."
    description="Pantau kondisi finansial Anda dalam satu tempat."
  >
    <section class="w-full max-w-xl self-center text-cent" aria-labelledby="login-title">
      <header class="mb-8 text-center md:mb-12">
        <h2 id="login-title" class="m-0 text-3xl font-bold tracking-tight text-[#173b34] md:text-4xl">Masuk</h2>
        <p class="mt-3 leading-6 text-[#71847f]">Gunakan akun FinSight Anda.</p>
      </header>

      <LoginForm :error-message="errorMessage" @submit="handleLogin" />
    </section>
  </AuthLayout>
</template>
