import { ref } from 'vue'

import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { getConversationMessages, getConversations, sendChatMessage } from '../api/chat.api'
import { createFinanceAccount } from '../api/finance-account.api'
import type { ChatMessage, Conversation, CreateFinanceAccountRequest, SendChatMessageRequest } from '../types/chat.types'

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
  const conversations = ref<Conversation[]>([])
  const isLoadingConversations = ref(false)
  const messages = ref<ChatMessage[]>([
    { id: 'welcome', role: 'assistant', content: 'Halo! Saya FinSight AI. Tanyakan apa saja tentang kondisi keuangan Anda.' },
  ])

  function applyConversation(conversation: Conversation): void {
    conversationId.value = conversation.id
    messages.value = (conversation.messages ?? []).map((item) => ({ id: String(item.id), role: item.role, content: item.message }))
  }

  async function loadConversations(): Promise<void> {
    isLoadingConversations.value = true
    try { conversations.value = await getConversations() } catch { /* sidebar remains usable */ } finally { isLoadingConversations.value = false }
  }

  async function selectConversation(id: number): Promise<void> {
    if (isLoading.value) return
    try {
      const conversation = conversations.value.find((item) => item.id === id)
      const conversationMessages = await getConversationMessages(id)
      applyConversation({
        id,
        title: conversation?.title ?? null,
        created_at: conversation?.created_at ?? '',
        updated_at: conversation?.updated_at ?? '',
        messages: conversationMessages,
      })
    } catch (error: unknown) { errorMessage.value = error instanceof Error ? error.message : 'Riwayat message gagal dimuat.' }
  }

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

      if (!conversations.value.some((item) => item.id === response.conversation_id)) {
        conversations.value.unshift({
          id: response.conversation_id,
          title: message.slice(0, 60),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          messages: [],
        })
      }

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

  void loadConversations()
  return { input, isLoading, errorMessage, messages, conversations, isLoadingConversations, handleSend, handleAccountCreationConfirmation, selectConversation }
}
