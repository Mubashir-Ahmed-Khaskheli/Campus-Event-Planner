import { ListTodo, Trash2 } from 'lucide-react'
import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { TaskStatusBadge } from '@/components/tasks/TaskStatusBadge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks/useAuth'
import { useEventTasks } from '@/hooks/useEventTasks'
import { readRegistrations } from '@/hooks/useUserEvents'
import { formatTaskDeadline } from '@/lib/format-deadline'
import { enhanceTask } from '@/lib/task-utils'
import { useLiveTime } from '@/hooks/useLiveTime'
import {
  addTask as storageAddTask,
  deleteTask as storageDeleteTask,
  getTasksByEvent,
} from '@/lib/taskStorage'


type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventId: string
  eventTitle: string
}


export function ManageTasksDialog({
  open,
  onOpenChange,
  eventId,
  eventTitle,
}: Props) {
  const { user } = useAuth()
  const { tasks, refreshTasks } = useEventTasks()

  const now = useLiveTime()
  const eventTasks = useMemo(() => {
    void tasks
    return getTasksByEvent(eventId).map((t) => enhanceTask(t, now))
  }, [eventId, tasks, now])

  const volunteers = useMemo(() => {
    return readRegistrations().filter(
      (r) => r.eventId === eventId && r.role === 'volunteer',
    )
  }, [eventId])

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [deadlineDate, setDeadlineDate] = useState('')
  const [deadlineTime, setDeadlineTime] = useState('')

  useEffect(() => {
    if (open && (!user || user.role !== 'organizer')) {
      onOpenChange(false)
    }
  }, [open, user, onOpenChange])

  function resetForm() {
    setTitle('')
    setDescription('')
    setAssignedTo('')
    setDeadlineDate('')
    setDeadlineTime('')
  }

  function handleAdd(e: FormEvent) {
    e.preventDefault()
    if (!user || user.role !== 'organizer') return
    if (!title.trim() || !assignedTo.trim() || !deadlineDate || !deadlineTime) {
      toast.error('Title, volunteer, deadline date, and time are required.')
      return
    }
    const email = assignedTo.trim()
    storageAddTask({
      id: crypto.randomUUID(),
      eventId,
      title: title.trim(),
      description: description.trim(),
      assignedTo: email,
      deadlineDate,
      deadlineTime,
      status: 'Pending',
    })
    refreshTasks()
    toast.success('Task added.')
    resetForm()
  }

  function handleDeleteTask(taskId: string, taskTitle: string) {
    if (!user || user.role !== 'organizer') return
    storageDeleteTask(taskId)
    refreshTasks()
    toast.success(`Removed “${taskTitle}”.`)
  }

  if (!user || user.role !== 'organizer') {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90vh,calc(100dvh-2rem))] gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle className="font-heading flex items-center gap-2 text-xl">
            <ListTodo className="size-5 text-primary" />
            Manage tasks
          </DialogTitle>
          <DialogDescription className="line-clamp-2">
            {eventTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="flex max-h-[calc(min(90vh,calc(100dvh-2rem))-8rem)] flex-col gap-6 overflow-y-auto px-6 pb-6">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">
              Tasks ({eventTasks.length})
            </h3>
            {eventTasks.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
                No tasks yet. Add one below.
              </p>
            ) : (
              <ul className="space-y-3">
                {eventTasks.map((t) => (
                  <li key={t.id}>
                    <Card
                      size="sm"
                      className="border-border/60 bg-card/80 py-0 shadow-sm ring-0"
                    >
                      <CardHeader className="gap-2 border-b-0 px-4 pb-0 pt-4">
                        <div className="flex items-start justify-between gap-3">
                          <CardTitle className="text-base font-semibold leading-snug">
                            {t.title}
                          </CardTitle>
                          <TaskStatusBadge status={t.statusOverride} />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3 pb-4 pt-2">
                        {t.description ? (
                          <p className="text-sm text-muted-foreground">
                            {t.description}
                          </p>
                        ) : null}
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <p>
                            <span className="font-medium text-foreground/80">
                              Volunteer email:
                            </span>{' '}
                            {t.assignedTo}
                          </p>
                          <p>
                            <span className="font-medium text-foreground/80">
                              Deadline:
                            </span>{' '}
                            {formatTaskDeadline(t)}
                            {t.status !== 'Done' && (
                              <span className="ml-2 text-[10px] uppercase font-bold text-muted-foreground/80">
                                ({t.countdownLabel})
                              </span>
                            )}
                          </p>
                          {t.status === 'Done' && (
                              <div className="text-xs bg-muted/40 p-2 rounded-lg border border-border/40 space-y-1">
                                {t.completionStatus === 'On Time' ? (
                                  <p className="font-medium text-green-600 dark:text-green-500">Completed on time</p>
                                ) : t.completionStatus === 'Late' ? (
                                  <p className="font-medium text-red-600 dark:text-red-500">
                                    Completed late <span className="text-[10px] font-normal text-red-600/80">(Late by {t.lateByLabel})</span>
                                  </p>
                                ) : (
                                  <p className="font-medium text-emerald-600 dark:text-emerald-500">Completed</p>
                                )}
                                {t.completedAt && (
                                  <p className="text-muted-foreground">
                                    Completed at: {new Date(t.completedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}, {new Date(t.completedAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true })}
                                  </p>
                                )}
                              </div>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full gap-2 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDeleteTask(t.id, t.title)}
                        >
                          <Trash2 className="size-4" />
                          Delete Task
                        </Button>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <form
            onSubmit={handleAdd}
            className="space-y-4 rounded-xl border border-border/60 bg-muted/20 p-4"
          >
            <h3 className="text-sm font-semibold text-foreground">Add task</h3>
            <div className="space-y-2">
              <Label htmlFor="mtd-title">Title</Label>
              <Input
                id="mtd-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mtd-desc">Description</Label>
              <Textarea
                id="mtd-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details (optional)"
                rows={3}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fix-task-assignment-email">Assign to Volunteer</Label>
              <select
                id="fix-task-assignment-email"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="" disabled>
                  Select a volunteer
                </option>
                {volunteers.map((v) => (
                  <option key={v.email} value={v.email}>
                    {v.name} ({v.email})
                  </option>
                ))}
              </select>
              {volunteers.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No volunteers registered for this event yet.
                </p>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="mtd-deadline-date">Deadline Date</Label>
                <Input
                  id="mtd-deadline-date"
                  type="date"
                  value={deadlineDate}
                  onChange={(e) => setDeadlineDate(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mtd-deadline-time">Deadline Time</Label>
                <Input
                  id="mtd-deadline-time"
                  type="time"
                  value={deadlineTime}
                  onChange={(e) => setDeadlineTime(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-primary-foreground shadow-md"
            >
              Add Task
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
