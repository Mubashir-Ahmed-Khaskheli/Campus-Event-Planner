import type { Task, TaskStatus } from '@/types/task'

const STORAGE_KEY = 'eventTasks'
/** Previous key used by an older version of the app; migrated once when `eventTasks` is empty. */
const LEGACY_STORAGE_KEY = 'cep-event-tasks'

function isTaskRecord(x: unknown): x is Task {
  if (typeof x !== 'object' || x === null) return false
  const o = x as Record<string, unknown>
  return (
    typeof o.id === 'string' &&
    typeof o.eventId === 'string' &&
    typeof o.title === 'string' &&
    typeof o.description === 'string' &&
    typeof o.assignedTo === 'string' &&
    (typeof o.deadline === 'string' || (typeof o.deadlineDate === 'string' && typeof o.deadlineTime === 'string')) &&
    (o.status === 'Pending' || o.status === 'Done') &&
    (typeof o.completedAt === 'string' || typeof o.completedAt === 'undefined')
  )
}

function readAll(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? (JSON.parse(raw) as unknown) : []
    let tasks = Array.isArray(parsed) ? parsed.filter(isTaskRecord) : []
    if (tasks.length === 0) {
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY)
      if (legacyRaw) {
        const legacyParsed = JSON.parse(legacyRaw) as unknown
        if (Array.isArray(legacyParsed)) {
          const legacyTasks = legacyParsed.filter(isTaskRecord)
          if (legacyTasks.length > 0) {
            writeAll(legacyTasks)
            localStorage.removeItem(LEGACY_STORAGE_KEY)
            tasks = legacyTasks
          }
        }
      }
    }
    return tasks
  } catch {
    return []
  }
}

function writeAll(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export function getTasks(): Task[] {
  return readAll()
}

export function getTasksByEvent(eventId: string): Task[] {
  return readAll().filter((t) => t.eventId === eventId)
}

export function getTasksByUser(userEmail: string): Task[] {
  const email = userEmail.trim().toLowerCase()
  if (!email) return []
  return readAll().filter(
    (t) => t.assignedTo.trim().toLowerCase() === email,
  )
}

export function addTask(task: Task): void {
  const tasks = readAll()
  const withoutDup = tasks.filter((t) => t.id !== task.id)
  withoutDup.push(task)
  writeAll(withoutDup)
}

export function deleteTask(taskId: string): void {
  writeAll(readAll().filter((t) => t.id !== taskId))
}

export function updateTaskStatus(taskId: string, status: TaskStatus): void {
  writeAll(readAll().map((t) => {
    if (t.id !== taskId) return t
    const updated = { ...t, status }
    if (status === 'Done' && !t.completedAt) {
      updated.completedAt = new Date().toISOString()
    }
    return updated
  }))
}

/** Remove every task for an event (e.g. when the event is deleted). */
export function removeTasksForEvent(eventId: string): void {
  writeAll(readAll().filter((t) => t.eventId !== eventId))
}
