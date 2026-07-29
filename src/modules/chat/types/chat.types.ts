export const CHAT_MESSAGE_ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant',
} as const

export type ChatMessageRole = (typeof CHAT_MESSAGE_ROLES)[keyof typeof CHAT_MESSAGE_ROLES]

export type AiResponseRoute = 'tool' | 'chat' | string

export interface ChatMessage {
  id: string
  role: ChatMessageRole
  content: string
  responseRoute?: AiResponseRoute
}

export interface SendChatMessageRequest {
  message: string
  conversation_id?: number
}

export interface AiChatResponse {
  success: boolean
  conversation_id: number
  route: AiResponseRoute
  message: string
  tool_name: string | null
  data: {
    transaction_id?: number
    [key: string]: unknown
  } | null
}
