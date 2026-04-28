const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const UNIV_EMAIL_RE = /@(students|organizer)\.muet\.edu\.pk$/

export function validateEmail(value: string): string | null {
  const t = value.trim()
  if (!t) return 'Email is required.'
  if (!EMAIL_RE.test(t)) return 'Enter a valid email address.'
  if (!UNIV_EMAIL_RE.test(t)) return 'Please use your university email'
  return null
}

export function validatePassword(value: string): string | null {
  if (!value) return 'Password is required.'
  if (value.length < 8) return 'Password must be at least 8 characters.'
  return null
}

export function validateRequired(value: string, label: string): string | null {
  if (!value.trim()) return `${label} is required.`
  return null
}
