import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateLabel(isoDate: string) {
  const parts = isoDate.split('-').map(Number)
  if (parts.length !== 3 || parts.some(Number.isNaN)) return isoDate
  const [y, m, d] = parts
  const dt = new Date(y, m - 1, d)
  return dt.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function getEventDateDisplay(dateLabel?: string, startDate?: string, endDate?: string): string {
  if (startDate && endDate) {
    if (startDate === endDate) {
      return formatDateLabel(startDate)
    }
    return `${formatDateLabel(startDate)} – ${formatDateLabel(endDate)}`
  }
  return dateLabel || ''
}
