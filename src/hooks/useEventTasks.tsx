import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

import { isAssignedToUser } from '@/lib/task-assignee'
import {
  addTask as storageAddTask,
  deleteTask as storageDeleteTask,
  getTasks as loadTasks,
  removeTasksForEvent as storageRemoveTasksForEvent,
  updateTaskStatus as storageUpdateStatus,
} from '@/lib/taskStorage'
import type { Task, TaskStatus } from '@/types/task'

export type AddTaskInput = {
  eventId: string
  title: string
  description: string
  assignedTo: string
  deadline: string
}

type EventTasksContextValue = {
  tasks: Task[]
  /** Re-read tasks from storage into React state (e.g. after direct `taskStorage` writes). */
  refreshTasks: () => void
  getTasksForEvent: (eventId: string) => Task[]
  getTasksForStudent: (email: string, fullName: string) => Task[]
  addTask: (input: AddTaskInput) => void
  deleteTask: (taskId: string) => void
  removeTasksForEvent: (eventId: string) => void
  setTaskStatus: (taskId: string, status: TaskStatus) => void
  markTaskDoneForStudent: (
    taskId: string,
    email: string,
    fullName: string,
  ) => boolean
}

const EventTasksContext = createContext<EventTasksContextValue | null>(null)

export function EventTasksProvider({ children }: { children: React.ReactNode }) {
  const [tick, setTick] = useState(0)
  const bump = useCallback(() => setTick((n) => n + 1), [])

  const tasks = useMemo(() => loadTasks(), [tick])

  const getTasksForEvent = useCallback(
    (eventId: string) => tasks.filter((t) => t.eventId === eventId),
    [tasks],
  )

  const getTasksForStudent = useCallback(
    (email: string, fullName: string) =>
      tasks.filter((t) => isAssignedToUser(t, email, fullName)),
    [tasks],
  )

  const addTask = useCallback(
    (input: AddTaskInput & { deadlineDate?: string; deadlineTime?: string }) => {
      const id = `task-${crypto.randomUUID()}`
      const next: Task = {
        id,
        eventId: input.eventId,
        title: input.title.trim(),
        description: input.description.trim(),
        assignedTo: input.assignedTo.trim(),
        deadline: input.deadline,
        deadlineDate: input.deadlineDate,
        deadlineTime: input.deadlineTime,
        status: 'Pending',
      }
      storageAddTask(next)
      bump()
    },
    [bump],
  )

  const deleteTask = useCallback(
    (taskId: string) => {
      storageDeleteTask(taskId)
      bump()
    },
    [bump],
  )

  const removeTasksForEvent = useCallback(
    (eventId: string) => {
      storageRemoveTasksForEvent(eventId)
      bump()
    },
    [bump],
  )

  const setTaskStatus = useCallback(
    (taskId: string, status: TaskStatus) => {
      storageUpdateStatus(taskId, status)
      bump()
    },
    [bump],
  )

  const markTaskDoneForStudent = useCallback(
    (taskId: string, email: string, fullName: string) => {
      const task = loadTasks().find((t) => t.id === taskId)
      if (
        !task ||
        !isAssignedToUser(task, email, fullName) ||
        task.status === 'Done'
      ) {
        return false
      }
      storageUpdateStatus(taskId, 'Done')
      bump()
      return true
    },
    [bump],
  )

  const refreshTasks = useCallback(() => bump(), [bump])

  const value = useMemo<EventTasksContextValue>(
    () => ({
      tasks,
      refreshTasks,
      getTasksForEvent,
      getTasksForStudent,
      addTask,
      deleteTask,
      removeTasksForEvent,
      setTaskStatus,
      markTaskDoneForStudent,
    }),
    [
      tasks,
      refreshTasks,
      getTasksForEvent,
      getTasksForStudent,
      addTask,
      deleteTask,
      removeTasksForEvent,
      setTaskStatus,
      markTaskDoneForStudent,
    ],
  )

  return (
    <EventTasksContext.Provider value={value}>
      {children}
    </EventTasksContext.Provider>
  )
}

export function useEventTasks() {
  const ctx = useContext(EventTasksContext)
  if (!ctx)
    throw new Error('useEventTasks must be used within EventTasksProvider')
  return ctx
}
