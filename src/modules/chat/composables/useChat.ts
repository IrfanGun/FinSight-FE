import { ref } from 'vue'

import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { sendChatMessage } from '../api/chat.api'
import { createFinanceAccount } from '../api/finance-account.api'
import type { ChatMessage, CreateFinanceAccountRequest, SendChatMessageRequest } from '../types/chat.types'

const CASH_ACCOUNT_REQUEST: Omit<CreateFinanceAccountRequest, 'user_id'> = {
  name: 'Cash',
  type: 'asset',
  subtype: 'cash',
  currency: 'IDR',
  balance: 0,
  is_active: true,
}

function needsAccountCreationConfirmation(message: string): boolean {
  return /belum ditemukan/i.test(message) && /ingin membuat akun\/aset/i.test(message)
}

export function useChat() {
  const authStore = useAuthStore()
  const input = ref('')
  const isLoading = ref(false)
  const errorMessage = ref('')
  const conversationId = ref<number>()
  const messages = ref<ChatMessage[]>([
    { id: 'welcome', role: 'assistant', content: 'Halo! Saya FinSight AI. Tanyakan apa saja tentang kondisi keuangan Anda.' },
  ])

  async function handleSend(): Promise<void> {
    const message = input.value.trim()
    if (!message || isLoading.value) return

    errorMessage.value = ''
    input.value = ''
    messages.value.push({ id: crypto.randomUUID(), role: 'user', content: message })
    isLoading.value = true

    try {
      const request: SendChatMessageRequest = { message }
      if (conversationId.value !== undefined) {
        request.conversation_id = conversationId.value
      }

      const response = await sendChatMessage(request)
      conversationId.value = response.conversation_id

      const requiresConfirmation = needsAccountCreationConfirmation(response.message)
      if (response.success || requiresConfirmation) {
        messages.value.push({
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response.message,
          requiresAccountCreationConfirmation: requiresConfirmation,
        })
      } else {
        errorMessage.value = response.message
      }
    } catch (error: unknown) {
      errorMessage.value = error instanceof Error ? error.message : 'Pesan gagal dikirim. Silakan coba lagi.'
    } finally {
      isLoading.value = false
    }
  }

  async function handleAccountCreationConfirmation(messageId: string, confirmed: boolean): Promise<void> {
    const message = messages.value.find((item) => item.id === messageId)
    if (!message || !message.requiresAccountCreationConfirmation || isLoading.value) return

    message.requiresAccountCreationConfirmation = false
    if (!confirmed) {
      messages.value.push({ id: crypto.randomUUID(), role: 'assistant', content: 'Baik, akun Cash tidak dibuat.' })
      return
    }

    const userId = authStore.currentUser?.id
    if (!userId) {
      errorMessage.value = 'Sesi pengguna tidak ditemukan. Silakan masuk kembali.'
      return
    }

    isLoading.value = true
    errorMessage.value = ''
    try {
      const account = await createFinanceAccount({ ...CASH_ACCOUNT_REQUEST, user_id: userId })
      messages.value.push({ id: crypto.randomUUID(), role: 'assistant', content: `Akun '${account.name}' berhasil dibuat.` })
    } catch (error: unknown) {
      message.requiresAccountCreationConfirmation = true
      errorMessage.value = error instanceof Error ? error.message : 'Akun gagal dibuat. Silakan coba lagi.'
    } finally {
      isLoading.value = false
    }
  }

  return { input, isLoading, errorMessage, messages, handleSend, handleAccountCreationConfirmation }
}
