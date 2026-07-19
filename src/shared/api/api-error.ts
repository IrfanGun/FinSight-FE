import axios from 'axios'

export interface ApiError {
  status: number | null
  code: string
  message: string
  fieldErrors?: Record<string, string[]>
  requestId?: string
}

interface ErrorResponseData {
  code?: unknown
  detail?: unknown
  field_errors?: unknown
  message?: unknown
  request_id?: unknown
}

function isFieldErrors(value: unknown): value is Record<string, string[]> {
  if (!value || typeof value !== 'object') return false

  return Object.values(value).every(
    (messages) =>
      Array.isArray(messages) && messages.every((message) => typeof message === 'string'),
  )
}

export function normalizeApiError(error: unknown): ApiError {
  if (!axios.isAxiosError<ErrorResponseData>(error)) {
    return {
      status: null,
      code: 'UNKNOWN_ERROR',
      message: 'Terjadi kesalahan. Silakan coba lagi.',
    }
  }

  const data = error.response?.data
  const status = error.response?.status ?? null
  const fallbackMessage = status === 401
    ? 'Email atau kata sandi salah.'
    : 'Tidak dapat menghubungi layanan. Silakan coba lagi.'

  return {
    status,
    code: typeof data?.code === 'string' ? data.code : 'REQUEST_FAILED',
    message:
      typeof data?.message === 'string'
        ? data.message
        : typeof data?.detail === 'string'
          ? data.detail
          : fallbackMessage,
    fieldErrors: isFieldErrors(data?.field_errors) ? data.field_errors : undefined,
    requestId: typeof data?.request_id === 'string' ? data.request_id : undefined,
  }
}

export function isApiError(error: unknown): error is ApiError {
  if (!error || typeof error !== 'object') return false
  return 'code' in error && 'message' in error && 'status' in error
}
