import axios from 'axios'

import { appConfig } from '@/shared/config/app.config'

let accessToken: string | null = null

export const httpClient = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

httpClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

export function setHttpAccessToken(token: string | null): void {
  accessToken = token
}
