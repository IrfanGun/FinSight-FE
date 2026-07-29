import { ref } from 'vue'

import { sendChatMessage } from '../api/chat.api'
import type { ChatMessage } from '../types/chat.types'

export function useChat() {
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
      const response = await sendChatMessage({ message, conversation_id: conversationId.value })
      conversationId.value = response.conversation_id

      if (response.success) {
        messages.value.push({ id: crypto.randomUUID(), role: 'assistant', content: response.message })
      } else {
        errorMessage.value = response.message
      }
    } catch (error: unknown) {
      errorMessage.value = error instanceof Error ? error.message : 'Pesan gagal dikirim. Silakan coba lagi.'
    } finally {
      isLoading.value = false
    }
  }

  return { input, isLoading, errorMessage, messages, handleSend }
}
