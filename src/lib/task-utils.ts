import type { Task } from '@/types/task'

export function getTaskDeadlineDate(task: Task): Date {
  if (task.deadlineDate && task.deadlineTime) {
    return new Date(`${task.deadlineDate}T${task.deadlineTime}`)
  }
  if (task.deadlineDate) {
    return new Date(`${task.deadlineDate}T23:59:59`)
  }
  if (task.deadline) {
    return new Date(`${task.deadline}T23:59:59`)
  }
  return new Date()
}

export type EnhancedTask = Task & {
  statusOverride: Task['status'] | 'Overdue' | 'Due Soon'
  countdownLabel: string
  isExpired: boolean
  completionStatus?: 'On Time' | 'Late'
  lateByLabel?: string
}

export function enhanceTask(task: Task, now: Date): EnhancedTask {
  let statusOverride: EnhancedTask['statusOverride'] = task.status
  let countdownLabel = ''
  let isExpired = false
  let completionStatus: EnhancedTask['completionStatus'] = undefined
  let lateByLabel = ''

  if (task.status === 'Done' && task.completedAt) {
    const dl = getTaskDeadlineDate(task)
    const compDate = new Date(task.completedAt)
    const diffMs = compDate.getTime() - dl.getTime()
    if (diffMs <= 0) {
      completionStatus = 'On Time'
    } else {
      completionStatus = 'Late'
      const diffHours = diffMs / 3600000
      const diffDays = diffMs / 86400000
      if (diffDays >= 1) {
        const remainderHours = Math.floor(diffHours % 24)
        lateByLabel = `${Math.floor(diffDays)}d ${remainderHours}h`
      } else if (diffHours >= 1) {
        const remainderMins = Math.floor((diffMs / 60000) % 60)
        lateByLabel = `${Math.floor(diffHours)}h ${remainderMins}m`
      } else {
        const mins = Math.max(1, Math.floor(diffMs / 60000))
        lateByLabel = `${mins}m`
      }
    }
  }

  if (task.status !== 'Done') {
    const dl = getTaskDeadlineDate(task)
    const diffMs = dl.getTime() - now.getTime()

    if (diffMs < 0) {
      statusOverride = 'Overdue'
      isExpired = true
      countdownLabel = 'Expired'
    } else {
      // Determine Due Soon vs Pending using 1 hour threshold (3600000 ms)
      if (diffMs <= 3600000) {
        statusOverride = 'Due Soon'
      }
      
      // Format countdown time
      const diffHours = diffMs / 3600000
      const diffDays = diffMs / 86400000
      if (diffDays >= 1) {
        const remainderHours = Math.floor(diffHours % 24)
        countdownLabel = `${Math.floor(diffDays)}d ${remainderHours}h left`
      } else if (diffHours >= 1) {
        const remainderMins = Math.floor((diffMs / 60000) % 60)
        countdownLabel = `${Math.floor(diffHours)}h ${remainderMins}m left`
      } else {
        const mins = Math.max(1, Math.floor(diffMs / 60000))
        countdownLabel = `${mins}m left`
      }
    }
  }

  return { ...task, statusOverride, countdownLabel, isExpired, completionStatus, lateByLabel }
}

export function sortEnhancedTasks(list: EnhancedTask[]) {
  const priority = { Overdue: 1, 'Due Soon': 2, Pending: 3, Done: 4 }
  return [...list].sort((a, b) => {
    const pA = priority[a.statusOverride] ?? 3
    const pB = priority[b.statusOverride] ?? 3
    if (pA !== pB) return pA - pB
    return getTaskDeadlineDate(a).getTime() - getTaskDeadlineDate(b).getTime()
  })
}
