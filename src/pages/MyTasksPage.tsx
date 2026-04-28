import { CalendarClock, CheckCircle2, ListTodo } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { toast } from 'sonner'

import { TaskStatusBadge } from '@/components/tasks/TaskStatusBadge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { useCreatedEvents } from '@/hooks/useCreatedEvents'
import { useEventTasks } from '@/hooks/useEventTasks'
import { formatTaskDeadline } from '@/lib/format-deadline'
import { enhanceTask, sortEnhancedTasks } from '@/lib/task-utils'
import { useLiveTime } from '@/hooks/useLiveTime'
import { resolveEventById } from '@/lib/resolve-event'
import {
  getTasksByUser,
  updateTaskStatus as storageUpdateTaskStatus,
} from '@/lib/taskStorage'





export function MyTasksPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { createdEvents } = useCreatedEvents()
  const { tasks, refreshTasks } = useEventTasks()

  const now = useLiveTime()
  const mine = useMemo(() => {
    void tasks
    if (!user || user.role !== 'student') return []
    const mapped = getTasksByUser(user.email).map(t => enhanceTask(t, now))
    return sortEnhancedTasks(mapped)
  }, [user, tasks, now])

  if (!user) return null

  if (user.role !== 'student') {
    return (
      <div className="rounded-2xl border border-border/60 bg-card/80 p-8 shadow-sm">
        <h1 className="font-heading text-2xl font-bold">My Tasks</h1>
        <p className="mt-2 text-muted-foreground">
          Assigned tasks are available to student accounts. Organizers manage
          tasks from the{' '}
          <Link to="/organizer" className="font-medium text-primary hover:underline">
            Organizer Panel
          </Link>
          .
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6 rounded-xl"
          onClick={() => navigate('/dashboard')}
        >
          Back to dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          My Tasks
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Tasks organizers assign to you—complete them before the deadline.
        </p>
      </div>

      {mine.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 px-6 py-16 text-center">
          <ListTodo className="mx-auto size-12 text-muted-foreground/70" />
          <h2 className="font-heading mt-4 text-lg font-semibold text-foreground">
            No tasks assigned yet
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            When an organizer assigns you work for an event, it will appear
            here.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {mine.map((t) => {
            const ev = resolveEventById(t.eventId, createdEvents)
            const eventTitle = ev?.title ?? 'Unknown Event'
            return (
              <li key={t.id}>
                <Card className="border-border/60 bg-card/90 shadow-sm ring-0">
                  <CardHeader className="gap-3 border-b-0 pb-0 pt-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 space-y-1">
                      <CardTitle className="font-heading text-lg font-semibold leading-snug text-foreground">
                        {t.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground/90">
                          Event:
                        </span>{' '}
                        {eventTitle}
                      </p>
                    </div>
                    <TaskStatusBadge status={t.statusOverride} />
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarClock className="size-4 shrink-0 text-primary" />
                      <span>
                        <span className="font-medium text-foreground/90">
                          Deadline:
                        </span>{' '}
                        {formatTaskDeadline(t)}
                        {t.status !== 'Done' && (
                          <span className="ml-2 text-[10px] uppercase font-bold text-muted-foreground/80">
                            ({t.countdownLabel})
                          </span>
                        )}
                      </span>
                    </p>
                    {t.status === 'Done' && (
                        <div className="text-sm">
                          {t.completionStatus === 'On Time' ? (
                            <p className="font-medium text-green-600 dark:text-green-500">Completed on time</p>
                          ) : t.completionStatus === 'Late' ? (
                            <>
                              <p className="font-medium text-red-600 dark:text-red-500">
                                Completed late <span className="text-xs font-normal text-red-600/80">(Late by {t.lateByLabel})</span>
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">Deadline was: {formatTaskDeadline(t)}</p>
                            </>
                          ) : (
                            <p className="font-medium text-emerald-600 dark:text-emerald-500">Completed</p>
                          )}
                          {t.completedAt && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Completed at: {new Date(t.completedAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true })}
                            </p>
                          )}
                        </div>
                    )}
                    {t.status !== 'Done' && (
                      <Button
                        type="button"
                        className="w-full gap-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-600/90 sm:w-auto"
                        onClick={() => {
                          storageUpdateTaskStatus(t.id, 'Done')
                          refreshTasks()
                          toast.success('Marked as done.')
                        }}
                      >
                        <CheckCircle2 className="size-4" />
                        Mark as Done
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
