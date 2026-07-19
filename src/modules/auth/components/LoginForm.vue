<script setup lang="ts">
import { reactive, ref } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Password from 'primevue/password'

import type { LoginFormErrors, LoginFormValues } from '../types/auth.types'
import { validateLoginForm } from '../validation/login.validation'

interface Props {
  isLoading?: boolean
  errorMessage?: string
  successMessage?: string
}

withDefaults(defineProps<Props>(), {
  isLoading: false,
  errorMessage: '',
  successMessage: '',
})

const emit = defineEmits<{
  submit: [values: LoginFormValues]
}>()

const form = reactive<LoginFormValues>({ email: '', password: '' })
const fieldErrors = reactive<LoginFormErrors>({})
const hasSubmitted = ref(false)

function handleSubmit(): void {
  hasSubmitted.value = true
  const errors = validateLoginForm(form)
  fieldErrors.email = errors.email
  fieldErrors.password = errors.password

  if (errors.email || errors.password) return
  emit('submit', { ...form })
}
</script>

<template>
  <form class="grid gap-5" novalidate @submit.prevent="handleSubmit">
    <Message v-if="errorMessage" severity="error" :closable="false">{{ errorMessage }}</Message>
    <Message v-if="successMessage" severity="success" :closable="false">{{ successMessage }}</Message>

    <div class="grid gap-2">
      <label class="text-sm font-semibold text-[#203d37]" for="email">Alamat email</label>
      <div class="relative">
        <i class="pi pi-envelope absolute top-1/2 left-4 z-10 -translate-y-1/2 text-[#78948e]" aria-hidden="true"></i>
        <InputText
          id="email"
          v-model.trim="form.email"
          type="email"
          autocomplete="email"
          placeholder="nama@email.com"
          :invalid="hasSubmitted && Boolean(fieldErrors.email)"
          aria-describedby="email-error"
          class="w-full rounded-xl! border-[#d9e5e1]! bg-white! py-3.5! pr-4! pl-11!"
          fluid
        />
      </div>
      <small v-if="hasSubmitted && fieldErrors.email" id="email-error" class="text-xs text-red-700">{{ fieldErrors.email }}</small>
    </div>

    <div class="grid gap-2">
      <label class="text-sm font-semibold text-[#203d37]" for="password">Kata sandi</label>
      <Password
        id="password"
        v-model="form.password"
        autocomplete="current-password"
        placeholder="Masukkan kata sandi"
        :feedback="false"
        :invalid="hasSubmitted && Boolean(fieldErrors.password)"
        aria-describedby="password-error"
        class="w-full"
        input-class="w-full rounded-xl! border-[#d9e5e1]! bg-white! px-4! py-3.5!"
        toggle-mask
        fluid
      />
      <small v-if="hasSubmitted && fieldErrors.password" id="password-error" class="text-xs text-red-700">{{ fieldErrors.password }}</small>
    </div>

    <Button
      type="submit"
      label="Masuk"
      :loading="isLoading"
      class="mt-1 rounded-xl! border-brand-700! bg-brand-700! px-4! py-3.5! font-bold! hover:border-brand-800! hover:bg-brand-800!"
      fluid
    />
  </form>
</template>
