import { CalendarDays, ListTodo, Plus, Trash2, Users } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { CategoryBadge } from '@/components/events/CategoryBadge'
import { CreateEventSheet } from '@/components/organizer/CreateEventSheet'
import { ManageTasksDialog } from '@/components/organizer/ManageTasksDialog'
import { ViewRegistrationsDialog } from '@/components/organizer/ViewRegistrationsDialog'
import { ViewReportsDialog } from '@/components/organizer/ViewReportsDialog'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useCreatedEvents } from '@/hooks/useCreatedEvents'
import { useEventTasks } from '@/hooks/useEventTasks'
import { readRegistrations } from '@/hooks/useUserEvents'
import { getTasksByEvent } from '@/lib/taskStorage'
import { cn } from '@/lib/utils'

export function OrganizerPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { createdEvents, deleteCreatedEvent } = useCreatedEvents()
  const { removeTasksForEvent, tasks } = useEventTasks()
  const [createOpen, setCreateOpen] = useState(false)
  const [manageEvent, setManageEvent] = useState<{
    id: string
    title: string
  } | null>(null)
  const [viewRegsEvent, setViewRegsEvent] = useState<{
    id: string
    title: string
  } | null>(null)
  const [viewReportsEvent, setViewReportsEvent] = useState<{
    id: string
    title: string
  } | null>(null)

  if (!user) return null

  if (user.role !== 'organizer') {
    return (
      <div className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-md sm:p-8">
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Organizer Panel
        </h1>
        <p className="mt-2 text-muted-foreground">
          This section is only available for organizers
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-4 rounded-xl"
          onClick={() => navigate('/dashboard')}
        >
          Back to dashboard
        </Button>
      </div>
    )
  }

  const mine = createdEvents.filter((e) => e.organizerEmail === user.email)

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Organizer Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Create events for the campus community and manage your listings.
          </p>
        </div>
        <Button
          type="button"
          size="lg"
          onClick={() => setCreateOpen(true)}
          className={cn(
            'h-11 shrink-0 gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-6',
            'text-primary-foreground shadow-lg shadow-indigo-500/30 hover:brightness-105',
          )}
        >
          <Plus className="size-5" />
          Create Event
        </Button>
      </div>

      <CreateEventSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
        organizerEmail={user.email}
      />

      {manageEvent && (
        <ManageTasksDialog
          key={manageEvent.id}
          open
          onOpenChange={(o) => {
            if (!o) setManageEvent(null)
          }}
          eventId={manageEvent.id}
          eventTitle={manageEvent.title}
        />
      )}

      {viewRegsEvent && (
        <ViewRegistrationsDialog
          key={`regs-${viewRegsEvent.id}`}
          open
          onOpenChange={(o) => {
            if (!o) setViewRegsEvent(null)
          }}
          eventId={viewRegsEvent.id}
          eventTitle={viewRegsEvent.title}
        />
      )}

      {viewReportsEvent && (
        <ViewReportsDialog
          key={`reports-${viewReportsEvent.id}`}
          open
          onOpenChange={(o) => {
            if (!o) setViewReportsEvent(null)
          }}
          eventId={viewReportsEvent.id}
          eventTitle={viewReportsEvent.title}
        />
      )}

      {mine.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-muted/15 px-6 py-16 text-center">
          <CalendarDays className="mx-auto size-12 text-muted-foreground/70" />
          <h2 className="font-heading mt-4 text-lg font-semibold text-foreground">
            No events yet
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your first event to see it listed here.
          </p>
          <Button
            type="button"
            className="mt-6 gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-primary-foreground shadow-md"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="size-4" />
            Create Event
          </Button>
        </div>
      ) : (
        <ul
          id="organizer-progress-tracker"
          className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {mine.map((ev) => {
            void tasks
            const eventTasks = getTasksByEvent(ev.id)
            const totalTasks = eventTasks.length
            const completedTasks = eventTasks.filter((t) => t.status === 'Done')
              .length
            const progress =
              totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

            const evRegs = readRegistrations().filter((r) => r.eventId === ev.id)

            return (
              <li
                key={ev.id}
                className="flex flex-col rounded-xl border border-border/60 bg-card/90 p-5 shadow-md transition-shadow hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-2">
                  <CategoryBadge category={ev.category} />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                    aria-label={`Delete ${ev.title}`}
                    onClick={() => {
                      deleteCreatedEvent(ev.id, user.email)
                      removeTasksForEvent(ev.id)
                      toast.success('Event removed.')
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <h2 className="font-heading mt-3 text-lg font-bold leading-snug text-foreground">
                  {ev.title}
                </h2>
                <div className="mt-2 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Tasks Completed: {completedTasks} / {totalTasks}
                  </p>
                  {totalTasks > 0 && (
                    <div
                      className="h-2 w-full overflow-hidden rounded-full bg-muted"
                      role="progressbar"
                      aria-valuenow={completedTasks}
                      aria-valuemin={0}
                      aria-valuemax={totalTasks}
                      aria-label={`Tasks completed for ${ev.title}`}
                    >
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-[width] duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>
                <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <CalendarDays className="size-4 shrink-0 text-primary" />
                    {ev.dateLabel}
                  </p>
                  <p className="pl-6 text-xs">{ev.timeLabel}</p>
                  <p className="line-clamp-2 leading-snug">{ev.venue}</p>
                </div>
                <div className="mt-4 flex flex-col gap-3 rounded-xl border border-border/40 bg-muted/20 p-3 text-center">
                  <div>
                    <p className="font-heading text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                      Total Participants
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {evRegs.length}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 rounded-lg bg-background hover:bg-accent"
                    onClick={() => setViewRegsEvent({ id: ev.id, title: ev.title })}
                  >
                    <Users className="size-4" />
                    View Participants
                  </Button>
                </div>
                <div className="mt-4 space-y-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full gap-2 rounded-xl border border-primary/20 bg-primary/10 font-semibold text-primary hover:bg-primary/15"
                    onClick={() => setManageEvent({ id: ev.id, title: ev.title })}
                  >
                    <ListTodo className="size-4" />
                    Manage Tasks
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full gap-2 rounded-xl text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setViewReportsEvent({ id: ev.id, title: ev.title })}
                  >
                    View Reports
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
