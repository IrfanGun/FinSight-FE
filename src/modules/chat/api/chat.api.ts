import { normalizeApiError } from '@/shared/api/api-error'
import { httpClient } from '@/shared/api/http-client'
import type { AiChatResponse, SendChatMessageRequest } from '../types/chat.types'

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
