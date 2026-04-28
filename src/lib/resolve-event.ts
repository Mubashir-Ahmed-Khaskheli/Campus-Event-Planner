import { MOCK_EVENTS } from '@/data/mockEvents'
import type { CampusEvent, OrganizerCreatedEvent } from '@/types/event'

export function resolveEventById(
  id: string,
  created: OrganizerCreatedEvent[],
): CampusEvent | undefined {
  const mock = MOCK_EVENTS.find((e) => e.id === id)
  if (mock) return mock
  return created.find((e) => e.id === id)
}

export function listBrowseEvents(
  created: OrganizerCreatedEvent[],
): CampusEvent[] {
  return [...MOCK_EVENTS, ...created]
}
