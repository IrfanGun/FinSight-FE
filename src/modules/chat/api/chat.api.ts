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

export async function sendChatMessage(
  request: SendChatMessageRequest,
  signal?: AbortSignal,
): Promise<AiChatResponse> {
  try {
    const { data } = await httpClient.post<unknown>('/ai/chat', request, { signal })
    if (!isAiChatResponse(data)) throw new Error('Invalid AI chat response.')
    return data
  } catch (error: unknown) {
    throw normalizeApiError(error)
  }
}
