import { ref } from 'vue'

import { isApiError } from '@/shared/api/api-error'
import { useAuthStore } from '../stores/auth.store'
import type { AuthUser, LoginFormValues } from '../types/auth.types'

export function useLogin() {
  const authStore = useAuthStore()
  const isLoading = ref(false)
  const errorMessage = ref('')

  async function submitLogin(values: LoginFormValues): Promise<AuthUser | null> {
    if (isLoading.value) return null

    isLoading.value = true
    errorMessage.value = ''

    try {
      return await authStore.signIn(values)
    } catch (error: unknown) {
      errorMessage.value = isApiError(error)
        ? error.message
        : 'Terjadi kesalahan. Silakan coba lagi.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, errorMessage, submitLogin }
}
