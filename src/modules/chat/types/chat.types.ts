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
  requiresAccountCreationConfirmation?: boolean
}

export interface ConversationMessage {
  id: number
  role: ChatMessageRole
  message: string
  intent: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

export interface Conversation {
  id: number
  title: string | null
  created_at: string
  updated_at: string
  messages?: ConversationMessage[]
}

export interface CreateFinanceAccountRequest {
  user_id: number
  name: string
  type: 'asset'
  subtype: 'cash'
  currency: 'IDR'
  balance: number
  is_active: boolean
}

export interface FinanceAccount extends CreateFinanceAccountRequest {
  id: number
  unit: string | null
  quantity: number | null
  created_at: string
  updated_at: string
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
