import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { setHttpAccessToken } from '@/shared/api/http-client'
import { getCurrentUser, login } from '../api/auth.api'
import type { AuthUser, LoginFormValues } from '../types/auth.types'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null)
  const currentUser = ref<AuthUser | null>(null)
  let hydrated = false
  const isAuthenticated = computed(
    () => Boolean(accessToken.value && currentUser.value),
  )

  async function signIn(credentials: LoginFormValues): Promise<AuthUser> {
    const response = await login(credentials)

    accessToken.value = response.accessToken
    currentUser.value = response.user
    setHttpAccessToken(response.accessToken)
    localStorage.setItem('finsight.auth.token', response.accessToken)
    localStorage.setItem('finsight.auth.user', JSON.stringify(response.user))

    return response.user
  }

  async function fetchCurrentUser(): Promise<AuthUser> {
    const user = await getCurrentUser()
    currentUser.value = user
    localStorage.setItem('finsight.auth.user', JSON.stringify(user))
    return user
  }

  function hydrate(): void {
    if (hydrated) return
    hydrated = true

    const token = localStorage.getItem('finsight.auth.token')
    const savedUser = localStorage.getItem('finsight.auth.user')
    if (!token || !savedUser) return

    try {
      accessToken.value = token
      currentUser.value = JSON.parse(savedUser) as AuthUser
      setHttpAccessToken(token)
    } catch {
      signOut()
    }
  }

  function signOut(): void {
    accessToken.value = null
    currentUser.value = null
    setHttpAccessToken(null)
    localStorage.removeItem('finsight.auth.token')
    localStorage.removeItem('finsight.auth.user')
  }

  return {
    accessToken,
    currentUser,
    isAuthenticated,
    signIn,
    fetchCurrentUser,
    hydrate,
    signOut,
  }
})
