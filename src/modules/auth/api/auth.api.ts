import { normalizeApiError } from '@/shared/api/api-error'
import { httpClient } from '@/shared/api/http-client'
import type {
  AuthUser,
  LoginApiResponse,
  LoginFormValues,
  LoginResponse,
} from '../types/auth.types'

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object'
}

function parseUser(value: unknown): AuthUser {
  if (
    !isRecord(value) ||
    typeof value.id !== 'number' ||
    typeof value.full_name !== 'string' ||
    typeof value.email !== 'string' ||
    typeof value.role !== 'string' ||
    typeof value.status !== 'string'
  ) {
    throw new Error('Invalid user response.')
  }

  return {
    id: value.id,
    fullName: value.full_name,
    email: value.email,
    role: value.role,
    status: value.status,
  }
}

function parseLoginResponse(value: unknown): LoginResponse {
  if (
    !isRecord(value) ||
    typeof value.access_token !== 'string' ||
    typeof value.token_type !== 'string' ||
    typeof value.expires_in !== 'number'
  ) {
    throw new Error('Invalid login response.')
  }

  return {
    accessToken: value.access_token,
    tokenType: value.token_type,
    expiresIn: value.expires_in,
    user: parseUser(value.user),
  }
}

export async function login(payload: LoginFormValues): Promise<LoginResponse> {
  try {
    const { data } = await httpClient.post<LoginApiResponse>('/auth/login', payload)
    return parseLoginResponse(data)
  } catch (error: unknown) {
    throw normalizeApiError(error)
  }
}

export async function getCurrentUser(): Promise<AuthUser> {
  try {
    const { data } = await httpClient.get<unknown>('/auth/me')
    return parseUser(data)
  } catch (error: unknown) {
    throw normalizeApiError(error)
  }
}
