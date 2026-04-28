export function formatTaskDeadline(task: { deadline?: string; deadlineDate?: string; deadlineTime?: string }) {
  if (task.deadlineDate && task.deadlineTime) {
    const dt = new Date(`${task.deadlineDate}T${task.deadlineTime}`)
    if (!isNaN(dt.getTime())) {
      const dateStr = dt.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })
      const timeStr = dt.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true })
      return `${dateStr}, ${timeStr}`
    }
  }

  const iso = task.deadlineDate || task.deadline || ''
  if (!iso.trim()) return '—'
  const parts = iso.split('-').map(Number)
  if (parts.length !== 3 || parts.some(Number.isNaN)) return iso
  const [y, m, d] = parts
  const dt = new Date(y, m - 1, d)
  return dt.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })
}

// Keep for legacy usages if any
export function formatDeadlineLabel(iso: string) {
  return formatTaskDeadline({ deadline: iso })
}
