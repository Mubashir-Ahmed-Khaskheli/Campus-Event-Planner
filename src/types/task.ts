export type TaskStatus = 'Pending' | 'Done'

/** Canonical task shape for the event task data layer. */
export interface Task {
  id: string
  eventId: string
  title: string
  description: string
  assignedTo: string
  deadline?: string // Optional legacy deadline string
  deadlineDate?: string
  deadlineTime?: string
  completedAt?: string
  status: TaskStatus
}

/** Alias for existing feature code that used this name. */
export type EventTask = Task
