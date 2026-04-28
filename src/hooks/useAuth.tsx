import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from 'react'

import type { User, UserRole } from '@/types/auth'

const STORAGE_KEY = 'cep-auth-user'
const USERS_REGISTRY_KEY = 'cep-users'

type StoredUserAccount = {
  email: string
  role: UserRole
}

type AuthState = {
  user: User | null
}

let memory: AuthState = { user: readStoredUser() }

function readStoredUser(): User | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

function persistUser(user: User | null) {
  if (user) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  else sessionStorage.removeItem(STORAGE_KEY)
}

const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot(): AuthState {
  return memory
}

function setUser(next: User | null) {
  memory = { user: next }
  persistUser(next)
  emit()
}

function isUserRole(x: unknown): x is UserRole {
  return x === 'student' || x === 'organizer'
}

function readRegisteredAccounts(): StoredUserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_REGISTRY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is StoredUserAccount => {
      if (typeof item !== 'object' || item === null) return false
      const o = item as Record<string, unknown>
      return typeof o.email === 'string' && isUserRole(o.role)
    })
  } catch {
    return []
  }
}

function findRegisteredAccount(email: string): StoredUserAccount | undefined {
  const key = email.trim().toLowerCase()
  if (!key) return undefined
  return readRegisteredAccounts().find(
    (u) => u.email.trim().toLowerCase() === key,
  )
}

function writeRegisteredAccounts(accounts: StoredUserAccount[]) {
  localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(accounts))
}

/** Appends to `cep-users` when the email is new; skips if already registered. */
function registerSignupInLocalRegistry(email: string, role: UserRole) {
  const trimmed = email.trim()
  if (!trimmed) return
  const normalized = trimmed.toLowerCase()
  const existing = readRegisteredAccounts()
  if (existing.some((u) => u.email.trim().toLowerCase() === normalized)) return
  writeRegisteredAccounts([...existing, { email: trimmed, role }])
}

type AuthContextValue = {
  user: User | null
  login: (email: string, password: string) => void
  signup: (payload: {
    fullName: string
    email: string
    password: string
    role: User['role']
  }) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  const login = useCallback((email: string, password: string) => {
    void password
    const trimmed = email.trim()
    const account = findRegisteredAccount(trimmed)
    const role: UserRole = account?.role ?? 'student'
    const localPart = trimmed.split('@')[0] ?? 'there'
    const displayName =
      localPart.length > 0
        ? localPart.charAt(0).toUpperCase() + localPart.slice(1)
        : 'User'
    setUser({
      fullName: displayName,
      email: trimmed,
      role,
    })
  }, [])

  const signup = useCallback(
    (payload: {
      fullName: string
      email: string
      password: string
      role: User['role']
    }) => {
      const email = payload.email.trim()
      registerSignupInLocalRegistry(email, payload.role)
      setUser({
        fullName: payload.fullName.trim(),
        email,
        role: payload.role,
      })
    },
    [],
  )

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user: state.user,
      login,
      signup,
      logout,
    }),
    [state.user, login, signup, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
