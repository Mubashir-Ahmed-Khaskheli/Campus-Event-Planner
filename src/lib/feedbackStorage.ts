export type Feedback = {
  eventId: string
  userEmail: string
  rating: number // 1 to 5
  comment: string
}

const FEEDBACK_KEY = 'cep-feedback'

export function readFeedback(): Feedback[] {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is Feedback => {
      if (typeof item !== 'object' || item === null) return false
      const o = item as Record<string, unknown>
      return (
        typeof o.eventId === 'string' &&
        typeof o.userEmail === 'string' &&
        typeof o.rating === 'number' &&
        typeof o.comment === 'string'
      )
    })
  } catch {
    return []
  }
}

export function writeFeedback(rows: Feedback[]) {
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(rows))
}

export function getFeedbackByEvent(eventId: string): Feedback[] {
  return readFeedback().filter((r) => r.eventId === eventId)
}

export function addFeedback(feedback: Feedback) {
  const all = readFeedback()
  // Discard older ones by this user on this event just in case
  const filtered = all.filter(
    (f) => !(f.eventId === feedback.eventId && f.userEmail === feedback.userEmail)
  )
  filtered.push(feedback)
  writeFeedback(filtered)
}
