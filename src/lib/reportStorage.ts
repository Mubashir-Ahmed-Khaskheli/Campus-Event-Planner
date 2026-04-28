export type Report = {
  eventId: string
  userEmail: string
  message: string
}

const REPORTS_KEY = 'cep-reports'

export function readReports(): Report[] {
  try {
    const raw = localStorage.getItem(REPORTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is Report => {
      if (typeof item !== 'object' || item === null) return false
      const o = item as Record<string, unknown>
      return (
        typeof o.eventId === 'string' &&
        typeof o.userEmail === 'string' &&
        typeof o.message === 'string'
      )
    })
  } catch {
    return []
  }
}

export function writeReports(rows: Report[]) {
  localStorage.setItem(REPORTS_KEY, JSON.stringify(rows))
}

export function getReportsByEvent(eventId: string): Report[] {
  return readReports().filter((r) => r.eventId === eventId)
}

export function addReport(report: Report) {
  const all = readReports()
  all.push(report)
  writeReports(all)
}
