import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { setHttpAccessToken } from '@/shared/api/http-client'
import { getCurrentUser, login } from '../api/auth.api'
import type { AuthUser, LoginFormValues } from '../types/auth.types'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null)
  const currentUser = ref<AuthUser | null>(null)
  const isAuthenticated = computed(
    () => Boolean(accessToken.value && currentUser.value),
  )

  async function signIn(credentials: LoginFormValues): Promise<AuthUser> {
    const response = await login(credentials)

    accessToken.value = response.accessToken
    currentUser.value = response.user
    setHttpAccessToken(response.accessToken)

    return response.user
  }

  async function fetchCurrentUser(): Promise<AuthUser> {
    const user = await getCurrentUser()
    currentUser.value = user
    return user
  }

  function signOut(): void {
    accessToken.value = null
    currentUser.value = null
    setHttpAccessToken(null)
  }

  return {
    accessToken,
    currentUser,
    isAuthenticated,
    signIn,
    fetchCurrentUser,
    signOut,
  }
})
