export interface LoginFormValues {
  email: string
  password: string
}

export type LoginFormErrors = Partial<Record<keyof LoginFormValues, string>>

export interface AuthUser {
  id: number
  fullName: string
  email: string
  role: string
  status: string
}

export interface LoginResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
  user: AuthUser
}

export interface LoginApiResponse {
  access_token: string
  token_type: string
  expires_in: number
  user: {
    id: number
    full_name: string
    email: string
    role: string
    status: string
  }
}
