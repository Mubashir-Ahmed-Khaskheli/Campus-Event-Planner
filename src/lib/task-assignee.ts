import type { EventTask } from '@/types/task'

/** Tasks are assigned by student email; `assignedTo` must match the user's email. */
export function isAssignedToUser(
  task: EventTask,
  email: string,
  _fullName: string,
): boolean {
  const a = task.assignedTo.trim().toLowerCase()
  if (!a) return false
  const e = email.trim().toLowerCase()
  return a === e
}
