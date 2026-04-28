import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useAuth } from '@/hooks/useAuth'
import type { UserRole } from '@/types/auth'

const REGISTRATIONS_KEY = 'cep-registrations'

export type RegisterForEventFormData = {
  name: string
  email: string
  phone: string
  role: 'attendee' | 'volunteer'
}

export type StoredEventRegistration = {
  eventId: string
  name: string
  email: string
  phone: string
  role: 'attendee' | 'volunteer'
}

export function readRegistrations(): StoredEventRegistration[] {
  try {
    const raw = localStorage.getItem(REGISTRATIONS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    const finalData = parsed.filter((item): item is StoredEventRegistration => {
      if (typeof item !== 'object' || item === null) return false
      const o = item as Record<string, unknown>
      return (
        typeof o.eventId === 'string' &&
        typeof o.name === 'string' &&
        typeof o.email === 'string' &&
        typeof o.phone === 'string' &&
        (o.role === 'attendee' || o.role === 'volunteer')
      )
    })
    return finalData
  } catch {
    return []
  }
}

export function getRegistrationsByEvent(eventId: string) {
  return readRegistrations().filter(r => r.eventId === eventId)
}

function writeRegistrations(rows: StoredEventRegistration[]) {
  localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(rows))
}

function registrationExists(
  rows: StoredEventRegistration[],
  eventId: string,
  emailLower: string,
): boolean {
  const e = emailLower.trim().toLowerCase()
  return rows.some(
    (r) =>
      r.eventId === eventId && r.email.trim().toLowerCase() === e,
  )
}

type UserEventsState = {
  bookmarkedIds: string[]
}

function storageKey(email: string) {
  return `cep-events-${email}`
}

function loadBookmarksFromSession(email: string): UserEventsState {
  try {
    const raw = sessionStorage.getItem(storageKey(email))
    if (!raw) return { bookmarkedIds: [] }
    const p = JSON.parse(raw) as {
      bookmarkedIds?: unknown
      registeredIds?: unknown
    }
    return {
      bookmarkedIds: Array.isArray(p.bookmarkedIds) ? p.bookmarkedIds : [],
    }
  } catch {
    return { bookmarkedIds: [] }
  }
}

type UserEventsContextValue = {
  registeredIds: string[]
  bookmarkedIds: string[]
  registeredCount: number
  bookmarkedCount: number
  isRegistered: (eventId: string) => boolean
  isBookmarked: (eventId: string) => boolean
  toggleBookmark: (eventId: string) => void
  registerForEvent: (
    eventId: string,
    formData: RegisterForEventFormData,
  ) => boolean
}

const UserEventsContext = createContext<UserEventsContextValue | null>(null)

function UserEventsInner({
  email,
  role,
  fullName,
  children,
}: {
  email: string
  role: UserRole
  fullName: string
  children: React.ReactNode
}) {
  const [state, setState] = useState<UserEventsState>(() =>
    loadBookmarksFromSession(email),
  )
  const [regVersion, setRegVersion] = useState(0)

  const bumpRegistrations = useCallback(() => {
    setRegVersion((v) => v + 1)
  }, [])

  /** One-time migration: legacy session `registeredIds` → `cep-registrations`. */
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey(email))
      if (!raw) return
      const p = JSON.parse(raw) as {
        bookmarkedIds?: unknown
        registeredIds?: unknown
      }
      const legacyIds = p.registeredIds
      if (!Array.isArray(legacyIds) || legacyIds.length === 0) return

      const all = readRegistrations()
      let changed = false
      for (const eventId of legacyIds) {
        if (typeof eventId !== 'string') continue
        if (registrationExists(all, eventId, email)) continue
        all.push({
          eventId,
          name: fullName.trim() || email,
          email: email.trim(),
          phone: "0000000000",
          role: 'attendee',
        })
        changed = true
      }
      if (changed) writeRegistrations(all)
      const nextSession = {
        bookmarkedIds: Array.isArray(p.bookmarkedIds) ? p.bookmarkedIds : [],
      }
      sessionStorage.setItem(storageKey(email), JSON.stringify(nextSession))
      setState({ bookmarkedIds: nextSession.bookmarkedIds })
      if (changed) setRegVersion((v) => v + 1)
    } catch {
      /* ignore */
    }
  }, [email, fullName])

  useEffect(() => {
    sessionStorage.setItem(storageKey(email), JSON.stringify(state))
  }, [state, email])

  const registrations = useMemo(() => readRegistrations(), [regVersion])

  const registeredIds = useMemo(() => {
    const key = email.trim().toLowerCase()
    return registrations
      .filter((r) => r.email.trim().toLowerCase() === key)
      .map((r) => r.eventId)
  }, [registrations, email])

  const isRegistered = useCallback(
    (eventId: string) => registeredIds.includes(eventId),
    [registeredIds],
  )

  const isBookmarked = useCallback(
    (eventId: string) => state.bookmarkedIds.includes(eventId),
    [state.bookmarkedIds],
  )

  const toggleBookmark = useCallback((eventId: string) => {
    setState((prev) => {
      const has = prev.bookmarkedIds.includes(eventId)
      const bookmarkedIds = has
        ? prev.bookmarkedIds.filter((id) => id !== eventId)
        : [...prev.bookmarkedIds, eventId]
      return { ...prev, bookmarkedIds }
    })
  }, [])

  const registerForEvent = useCallback(
    (eventId: string, formData: RegisterForEventFormData) => {
      if (role === 'organizer') return false
      const name = formData.name.trim()
      const regEmail = formData.email.trim()
      const regPhone = formData.phone.trim()
      const regRole = formData.role
      if (!name || !regEmail.includes('@') || !regRole || regPhone.length < 10) return false

      const all = readRegistrations()
      if (registrationExists(all, eventId, regEmail)) return false

      const newReg: StoredEventRegistration = { eventId, name, email: regEmail, role: regRole, phone: regPhone }
      all.push(newReg)
      writeRegistrations(all)
      console.log('Saved new registration:', newReg)
      console.log('All registrations:', all)
      bumpRegistrations()
      return true
    },
    [role, bumpRegistrations],
  )

  const value = useMemo(
    () => ({
      registeredIds,
      bookmarkedIds: state.bookmarkedIds,
      registeredCount: registeredIds.length,
      bookmarkedCount: state.bookmarkedIds.length,
      isRegistered,
      isBookmarked,
      toggleBookmark,
      registerForEvent,
    }),
    [
      registeredIds,
      state.bookmarkedIds,
      isRegistered,
      isBookmarked,
      toggleBookmark,
      registerForEvent,
    ],
  )

  return (
    <UserEventsContext.Provider value={value}>
      {children}
    </UserEventsContext.Provider>
  )
}

/** In-memory empty context when logged out (hooks must not be used). */
function UserEventsLoggedOutContext({
  children,
}: {
  children: React.ReactNode
}) {
  const value = useMemo<UserEventsContextValue>(
    () => ({
      registeredIds: [],
      bookmarkedIds: [],
      registeredCount: 0,
      bookmarkedCount: 0,
      isRegistered: () => false,
      isBookmarked: () => false,
      toggleBookmark: () => {},
      registerForEvent: () => false,
    }),
    [],
  )

  return (
    <UserEventsContext.Provider value={value}>
      {children}
    </UserEventsContext.Provider>
  )
}

export function UserEventsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const email = user?.email

  if (!email) {
    return (
      <UserEventsLoggedOutContext>{children}</UserEventsLoggedOutContext>
    )
  }

  return (
    <UserEventsInner
      key={email}
      email={email}
      role={user.role}
      fullName={user.fullName}
    >
      {children}
    </UserEventsInner>
  )
}

export function useUserEvents() {
  const ctx = useContext(UserEventsContext)
  if (!ctx)
    throw new Error('useUserEvents must be used within UserEventsProvider')
  return ctx
}
