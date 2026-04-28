import {
  Bookmark,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  LayoutGrid,
  ListTodo,
  PenLine,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import { EventPreviewRow } from '@/components/dashboard/EventPreviewRow'
import { TaskStatusBadge } from '@/components/tasks/TaskStatusBadge'
import { Button } from '@/components/ui/button'
import { formatTaskDeadline } from '@/lib/format-deadline'
import { enhanceTask, sortEnhancedTasks } from '@/lib/task-utils'
import { useLiveTime } from '@/hooks/useLiveTime'
import { resolveEventById } from '@/lib/resolve-event'
import { useAuth } from '@/hooks/useAuth'
import { useCreatedEvents } from '@/hooks/useCreatedEvents'
import { useEventTasks } from '@/hooks/useEventTasks'
import { useUserEvents } from '@/hooks/useUserEvents'

const roleLabel: Record<string, string> = {
  student: 'Student',
  organizer: 'Organizer',
}



export function DashboardPage() {
  const { user } = useAuth()
  const { createdEvents } = useCreatedEvents()
  const {
    registeredIds,
    bookmarkedIds,
    registeredCount,
    bookmarkedCount,
  } = useUserEvents()
  const { getTasksForStudent, markTaskDoneForStudent } = useEventTasks()

  if (!user) return null

  const roleHint =
    user.role === 'organizer'
      ? 'Create and manage your events'
      : 'Explore and register for upcoming events'

  const myCreated =
    user.role === 'organizer'
      ? createdEvents.filter((e) => e.organizerEmail === user.email)
      : []
  const createdCount = myCreated.length
  const createdPreview = myCreated.slice(0, 3)

  const registeredPreview = registeredIds
    .slice(0, 3)
    .map((id) => resolveEventById(id, createdEvents))
    .filter((e): e is NonNullable<typeof e> => e != null)

  const bookmarkedPreview = bookmarkedIds
    .slice(0, 3)
    .map((id) => resolveEventById(id, createdEvents))
    .filter((e): e is NonNullable<typeof e> => e != null)

  const now = useLiveTime()
  const studentTasks =
    user.role === 'student'
      ? getTasksForStudent(user.email, user.fullName).map((t) => enhanceTask(t, now))
      : []
  const myTasksPreview = sortEnhancedTasks(studentTasks).slice(0, 3)

  if (user.role === 'organizer') {
    return (
      <div className="space-y-8">
        <div className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-lg shadow-indigo-500/5 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                <Sparkles className="size-3.5" aria-hidden />
                {roleLabel[user.role] ?? user.role}
              </p>
              <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Welcome, {user.fullName}
              </h1>
              <p className="max-w-xl text-base text-muted-foreground">
                {roleHint}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:max-w-md">
          <div className="flex gap-4 rounded-2xl border border-border/60 bg-card/90 p-5 shadow-sm">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-700 dark:text-indigo-300">
              <PenLine className="size-6" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-muted-foreground">
                My created events
              </p>
              <p className="font-heading mt-1 text-3xl font-bold tabular-nums text-foreground">
                {createdCount}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Total events under your organizer account
              </p>
            </div>
          </div>
        </div>

        <section id="fix-organizer-my-events" className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                My Created Events
              </h2>
              <p className="text-sm text-muted-foreground">
                Events you published—create and edit them from the organizer
                panel.
              </p>
            </div>
            <Link
              to="/organizer"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Open organizer panel
              <ChevronRight className="size-4" />
            </Link>
          </div>
          {createdPreview.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 px-5 py-10 text-center">
              <PenLine className="mx-auto size-10 text-muted-foreground/70" />
              <p className="mt-3 font-medium text-foreground">
                No events created yet
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Use the Organizer Panel to publish your first campus event.
              </p>
              <Link
                to="/organizer"
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
              >
                Go to Organizer Panel
              </Link>
            </div>
          ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {createdPreview.map((ev) => (
                <li key={ev.id}>
                  <EventPreviewRow event={ev} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-lg shadow-indigo-500/5 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              <Sparkles className="size-3.5" aria-hidden />
              {roleLabel[user.role] ?? user.role}
            </p>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Welcome, {user.fullName}
            </h1>
            <p className="max-w-xl text-base text-muted-foreground">{roleHint}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex gap-4 rounded-2xl border border-border/60 bg-card/90 p-5 shadow-sm">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CalendarCheck className="size-6" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground">
              Registered Events
            </p>
            <p className="font-heading mt-1 text-3xl font-bold tabular-nums text-foreground">
              {registeredCount}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Events you&apos;ve signed up for
            </p>
          </div>
        </div>
        <div className="flex gap-4 rounded-2xl border border-border/60 bg-card/90 p-5 shadow-sm">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-700 dark:text-violet-300">
            <Bookmark className="size-6" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground">
              Bookmarked Events
            </p>
            <p className="font-heading mt-1 text-3xl font-bold tabular-nums text-foreground">
              {bookmarkedCount}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Saved to revisit later
            </p>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              My Tasks
            </h2>
            <p className="text-sm text-muted-foreground">
              Assigned to you by event organizers
            </p>
          </div>
          {studentTasks.length > 0 && (
            <Link
              to="/my-tasks"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View all
              <ChevronRight className="size-4" />
            </Link>
          )}
        </div>
        {myTasksPreview.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 px-5 py-10 text-center">
            <ListTodo className="mx-auto size-10 text-muted-foreground/70" />
            <p className="mt-3 font-medium text-foreground">No tasks yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              When you&apos;re assigned work for an event, it will show here.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {myTasksPreview.map((t) => {
              const ev = resolveEventById(t.eventId, createdEvents)
              const eventTitle = ev?.title ?? 'Event'
              return (
                <li
                  key={t.id}
                  className="rounded-xl border border-border/60 bg-card/80 p-4 shadow-sm"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <TaskStatusBadge status={t.statusOverride} />
                      </div>
                      <p className="font-heading font-semibold text-foreground">
                        {t.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Event: {eventTitle}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarClock className="size-3.5 text-primary" />
                        Due {formatTaskDeadline(t)}
                        {t.status !== 'Done' && (
                          <span className="ml-2 text-[10px] uppercase font-bold text-muted-foreground/80">
                            ({t.countdownLabel})
                          </span>
                        )}
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
                    </div>
                    {t.status !== 'Done' && (
                      <Button
                        type="button"
                        size="sm"
                        className="shrink-0 gap-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-600/90"
                        onClick={() => {
                          const ok = markTaskDoneForStudent(
                            t.id,
                            user.email,
                            user.fullName,
                          )
                          if (ok) toast.success('Marked as done.')
                          else toast.error('Could not update task.')
                        }}
                      >
                        <CheckCircle2 className="size-3.5" />
                        Mark as Done
                      </Button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Registered Events
            </h2>
            <p className="text-sm text-muted-foreground">
              Preview of events you&apos;re attending
            </p>
          </div>
          {registeredCount > 0 && (
            <Link
              to="/my-events"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View all
              <ChevronRight className="size-4" />
            </Link>
          )}
        </div>
        {registeredPreview.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 px-5 py-10 text-center">
            <LayoutGrid className="mx-auto size-10 text-muted-foreground/70" />
            <p className="mt-3 font-medium text-foreground">
              No registrations yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse events and tap Register on any event you&apos;d like to
              join.
            </p>
            <Link
              to="/events"
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              Explore events
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {registeredPreview.map((ev) => (
              <li key={ev.id}>
                <EventPreviewRow event={ev} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Bookmarked Events
            </h2>
            <p className="text-sm text-muted-foreground">
              Events you&apos;ve saved for later
            </p>
          </div>
          {bookmarkedCount > 0 && (
            <Link
              to="/events"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Find more
              <ChevronRight className="size-4" />
            </Link>
          )}
        </div>
        {bookmarkedPreview.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 px-5 py-10 text-center">
            <Bookmark className="mx-auto size-10 text-muted-foreground/70" />
            <p className="mt-3 font-medium text-foreground">No bookmarks yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tap the bookmark icon on an event card or detail page to save it
              here.
            </p>
            <Link
              to="/events"
              className="mt-4 inline-flex items-center justify-center rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Browse events
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {bookmarkedPreview.map((ev) => (
              <li key={ev.id}>
                <EventPreviewRow event={ev} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
