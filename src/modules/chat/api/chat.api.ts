import { normalizeApiError } from '@/shared/api/api-error'
import { httpClient } from '@/shared/api/http-client'
import type { AiChatResponse, Conversation, ConversationMessage, SendChatMessageRequest } from '../types/chat.types'

function isAiChatResponse(value: unknown): value is AiChatResponse {
  if (!value || typeof value !== 'object') return false
  const response = value as Record<string, unknown>
  return typeof response.success === 'boolean'
    && typeof response.conversation_id === 'number'
    && typeof response.route === 'string'
    && typeof response.message === 'string'
    && (response.tool_name === null || typeof response.tool_name === 'string')
    && (response.data === null || typeof response.data === 'object')
}

function normalizeToolCallMessage(message: string): string {
  const match = message.match(/^<function\(([^)]+)\)\s*>?(\{[\s\S]*\})(?:<\/function>)?$/)
  if (!match) return message

  const toolName = match[1]
  const rawArguments = match[2]
  if (!toolName || !rawArguments) return 'Permintaan AI belum dapat diproses. Silakan coba lagi.'
  let argumentsValue: Record<string, unknown>
  try {
    const parsed: unknown = JSON.parse(rawArguments)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return 'Permintaan AI belum dapat diproses. Silakan coba lagi.'
    argumentsValue = parsed as Record<string, unknown>
  } catch {
    return 'Permintaan AI belum dapat diproses. Silakan coba lagi.'
  }

  if (toolName === 'update_transaction' && argumentsValue.transaction_id == null) {
    return 'Detail perubahan transaksi belum lengkap. Silakan lanjutkan dengan informasi yang benar, misalnya nominal atau tanggal transaksi.'
  }

  return 'Permintaan transaksi belum dapat diproses. Silakan coba lagi dengan informasi yang lebih lengkap.'
}

export async function sendChatMessage(
  request: SendChatMessageRequest,
  signal?: AbortSignal,
): Promise<AiChatResponse> {
  try {
    const { data } = await httpClient.post<unknown>('/ai/chat', request, { signal })
    if (!isAiChatResponse(data)) throw new Error('Invalid AI chat response.')
    return { ...data, message: normalizeToolCallMessage(data.message) }
  } catch (error: unknown) {
    throw normalizeApiError(error)
  }
}

export async function getConversations(signal?: AbortSignal): Promise<Conversation[]> {
  try {
    const { data } = await httpClient.get<unknown>('/ai/conversations', { signal })
    const conversations = Array.isArray(data)
      ? data
      : (data as { items?: unknown; data?: unknown })?.items ?? (data as { data?: unknown })?.data
    if (!Array.isArray(conversations)) throw new Error('Invalid conversations response.')
    return conversations as Conversation[]
  } catch (error: unknown) {
    throw normalizeApiError(error)
  }
}

export async function getConversation(conversationId: number, signal?: AbortSignal): Promise<Conversation> {
  try {
    const { data } = await httpClient.get<Conversation>(`/ai/conversations/${conversationId}`, { signal })
    if (!data || typeof data.id !== 'number' || !Array.isArray(data.messages)) throw new Error('Invalid conversation response.')
    return data
  } catch (error: unknown) {
    throw normalizeApiError(error)
  }
}

export async function getConversationMessages(
  conversationId: number,
  page = 1,
  pageSize = 20,
  signal?: AbortSignal,
): Promise<ConversationMessage[]> {
  try {
    const { data } = await httpClient.get<unknown>(`/ai/conversations/${conversationId}/messages`, {
      params: { page, page_size: pageSize },
      signal,
    })
    const messages = Array.isArray(data)
      ? data
      : (data as { items?: unknown })?.items
    if (!Array.isArray(messages)) throw new Error('Invalid conversation messages response.')
    return messages as ConversationMessage[]
  } catch (error: unknown) {
    throw normalizeApiError(error)
  }
}
