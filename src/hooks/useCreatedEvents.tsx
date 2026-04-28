import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import type { EventCategory, OrganizerCreatedEvent } from '@/types/event'

const STORAGE_KEY = 'cep-created-events'

function loadFromStorage(): OrganizerCreatedEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const p = JSON.parse(raw) as unknown
    if (!Array.isArray(p)) return []
    return p.filter(
      (x): x is OrganizerCreatedEvent =>
        typeof x === 'object' &&
        x !== null &&
        'id' in x &&
        'organizerEmail' in x &&
        typeof (x as OrganizerCreatedEvent).id === 'string',
    )
  } catch {
    return []
  }
}

function saveToStorage(events: OrganizerCreatedEvent[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
}

export type CreateEventInput = {
  title: string
  description: string
  dateLabel?: string
  startDate?: string
  endDate?: string
  timeLabel: string
  venue: string
  category: EventCategory
  capacity?: number
}

type CreatedEventsContextValue = {
  createdEvents: OrganizerCreatedEvent[]
  addCreatedEvent: (input: CreateEventInput, organizerEmail: string) => void
  deleteCreatedEvent: (id: string, organizerEmail: string) => void
}

const CreatedEventsContext = createContext<CreatedEventsContextValue | null>(
  null,
)

export function CreatedEventsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [createdEvents, setCreatedEvents] = useState<OrganizerCreatedEvent[]>(
    () => loadFromStorage(),
  )

  useEffect(() => {
    saveToStorage(createdEvents)
  }, [createdEvents])

  const addCreatedEvent = useCallback(
    (input: CreateEventInput, organizerEmail: string) => {
      const id = `org-${crypto.randomUUID()}`
      const next: OrganizerCreatedEvent = {
        ...input,
        id,
        organizerEmail,
      }
      setCreatedEvents((prev) => [...prev, next])
    },
    [],
  )

  const deleteCreatedEvent = useCallback(
    (id: string, organizerEmail: string) => {
      setCreatedEvents((prev) =>
        prev.filter(
          (e) => !(e.id === id && e.organizerEmail === organizerEmail),
        ),
      )
    },
    [],
  )

  const value = useMemo<CreatedEventsContextValue>(
    () => ({
      createdEvents,
      addCreatedEvent,
      deleteCreatedEvent,
    }),
    [createdEvents, addCreatedEvent, deleteCreatedEvent],
  )

  return (
    <CreatedEventsContext.Provider value={value}>
      {children}
    </CreatedEventsContext.Provider>
  )
}

export function useCreatedEvents() {
  const ctx = useContext(CreatedEventsContext)
  if (!ctx)
    throw new Error('useCreatedEvents must be used within CreatedEventsProvider')
  return ctx
}
