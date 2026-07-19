import type { LoginFormErrors, LoginFormValues } from '../types/auth.types'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MINIMUM_PASSWORD_LENGTH = 8

export function validateLoginForm(values: LoginFormValues): LoginFormErrors {
  const errors: LoginFormErrors = {}

  if (!values.email) {
    errors.email = 'Email wajib diisi.'
  } else if (!EMAIL_PATTERN.test(values.email)) {
    errors.email = 'Format email tidak valid.'
  }

  if (!values.password) {
    errors.password = 'Kata sandi wajib diisi.'
  } else if (values.password.length < MINIMUM_PASSWORD_LENGTH) {
    errors.password = `Gunakan minimal ${MINIMUM_PASSWORD_LENGTH} karakter.`
  }

  return errors
}
