import { normalizeApiError } from '@/shared/api/api-error'
import { httpClient } from '@/shared/api/http-client'
import { extractAssetAccounts } from '../lib/asset-count'

export interface AssetAccount {
  id: number
  type: string
  subtype: string
  balance: number
}

type UnknownRecord = Record<string, unknown>

export class InvalidAssetResponseError extends Error {
  constructor(message = 'Invalid asset response.') {
    super(message)
    this.name = 'InvalidAssetResponseError'
  }
}

function isRecord(value: unknown): value is UnknownRecord {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value)
  )
}

/**
 * Menerima:
 * - number finite
 * - string numerik, misalnya "123.45"
 *
 * Menolak:
 * - null
 * - undefined
 * - string kosong
 * - NaN
 * - Infinity
 * - boolean
 * - object
 */
function parseFiniteNumber(value: unknown): number | undefined {
  if (typeof value === 'number') {
    return Number.isFinite(value)
      ? value
      : undefined
  }

  if (typeof value === 'string') {
    const normalized = value.trim()

    if (normalized === '') {
      return undefined
    }

    const parsed = Number(normalized)

    return Number.isFinite(parsed)
      ? parsed
      : undefined
  }

  return undefined
}

function normalizeRequiredString(
  value: unknown,
): string | undefined {
  if (typeof value !== 'string') {
    return undefined
  }

  const normalized = value.trim().toLowerCase()

  return normalized !== ''
    ? normalized
    : undefined
}

function normalizeOptionalString(value: unknown): string {
  return typeof value === 'string'
    ? value.trim().toLowerCase()
    : ''
}

function parseAssetAccount(value: unknown): AssetAccount {
  if (!isRecord(value)) {
    throw new InvalidAssetResponseError()
  }

  const id = value.id
  const type = normalizeRequiredString(value.type)
  const subtype = normalizeOptionalString(value.subtype)
  const balance = parseFiniteNumber(value.balance)

  if (
    typeof id !== 'number' ||
    !Number.isInteger(id) ||
    id <= 0 ||
    type === undefined ||
    balance === undefined
  ) {
    throw new InvalidAssetResponseError()
  }

  return {
    id,
    type,
    subtype,
    balance,
  }
}

function parseAssetAccounts(value: unknown): AssetAccount[] {
  return extractAssetAccounts(value).map(parseAssetAccount)
}

export async function getAssetAccounts(
  userId: number,
  signal?: AbortSignal,
): Promise<AssetAccount[]> {
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error('Invalid user ID.')
  }

  try {
    const { data } = await httpClient.get<unknown>(
      '/finance-accounts/assets',
      {
        params: {
          user_id: userId,
        },
        signal,
      },
    )

    return parseAssetAccounts(data)
  } catch (error: unknown) {
    throw normalizeApiError(error)
  }
}

export async function getAssetTotals(userId: number) {
  const accounts = await getAssetAccounts(userId)
  const total = (type: string) => accounts.filter((account) => account.type === type).reduce((sum, account) => sum + account.balance, 0)
  return { wallet: total('wallet'), bank: total('bank'), investment: total('investment'), walletCount: accounts.filter((a) => a.type === 'wallet').length, bankCount: accounts.filter((a) => a.type === 'bank').length, investmentCount: accounts.filter((a) => a.type === 'investment').length }
}

