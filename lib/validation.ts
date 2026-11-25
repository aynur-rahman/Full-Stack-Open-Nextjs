export type FormState = { errors?: Record<string, string>; values?: Record<string, string>; success?: boolean; message?: string }
export function text(data: FormData, key: string) { const value = data.get(key); return typeof value === 'string' ? value : '' }
export function positiveId(value: unknown) { const n = Number(value); return typeof value === 'string' && /^[1-9]\d*$/.test(value) && Number.isSafeInteger(n) && n <= 2147483647 ? n : null }
export function registrationErrors(values: { username: string; name: string; password: string; passwordConfirm: string }) {
  const errors: Record<string, string> = {}
  if (values.username.trim().length < 4 || values.username.length > 100 || !/^[a-zA-Z0-9_.-]+$/.test(values.username)) errors.username = 'Use 4–100 letters, numbers, dots, hyphens or underscores.'
  if (!values.name.trim() || values.name.length > 200) errors.name = 'Enter a name of up to 200 characters.'
  if (values.password.length < 4 || Buffer.byteLength(values.password) > 72) errors.password = 'Use at least 4 characters and no more than 72 bytes.'
  if (values.password !== values.passwordConfirm) errors.passwordConfirm = 'Passwords must match.'
  return errors
}
export function blogErrors(values: Record<string, string>) {
  const errors: Record<string, string> = {}
  for (const key of ['title', 'author', 'url']) if (values[key].trim().length < 5 || values[key].length > 2000) errors[key] = `${key[0].toUpperCase() + key.slice(1)} must contain 5–2000 characters.`
  try { if (!['http:', 'https:'].includes(new URL(values.url).protocol)) errors.url = 'Use an http:// or https:// URL.' }
  catch { errors.url = 'Enter a valid http:// or https:// URL.' }
  return errors
}
export function uniqueViolation(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  return ('code' in error && error.code === '23505') || ('cause' in error && uniqueViolation(error.cause))
}
