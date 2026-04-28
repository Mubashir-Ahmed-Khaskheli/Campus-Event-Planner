import { CalendarPlus, PenLine, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

import { EventPreviewRow } from '@/components/dashboard/EventPreviewRow'
import { buttonVariants } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useCreatedEvents } from '@/hooks/useCreatedEvents'
import { useUserEvents } from '@/hooks/useUserEvents'
import { resolveEventById } from '@/lib/resolve-event'
import { cn } from '@/lib/utils'

export function MyEventsPage() {
  const { user } = useAuth()
  const { createdEvents } = useCreatedEvents()
  const { registeredIds } = useUserEvents()

  if (!user) return null

  if (user.role === 'organizer') {
    const mine = createdEvents.filter((e) => e.organizerEmail === user.email)

    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            My Created Events
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Events you manage as an organizer. Registration is not available for
            organizer accounts.
          </p>
        </div>

        {mine.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-gradient-to-b from-muted/30 to-card/50 px-6 py-16 text-center shadow-inner">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
              <PenLine className="size-8" aria-hidden />
            </div>
            <h2 className="font-heading mt-6 text-xl font-semibold tracking-tight text-foreground">
              No events created yet
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Use the Organizer Panel to publish campus events.
            </p>
            <div className="mt-8">
              <Link
                to="/organizer"
                className={cn(
                  buttonVariants({ variant: 'default', size: 'lg' }),
                  'h-11 rounded-xl gap-2 px-6 shadow-md shadow-indigo-500/20',
                )}
              >
                <Sparkles className="size-4" />
                Open Organizer Panel
              </Link>
            </div>
          </div>
        ) : (
          <ul className="space-y-3">
            {mine.map((ev) => (
              <li key={ev.id}>
                <EventPreviewRow event={ev} />
              </li>
            ))}
          </ul>
        )}

        {mine.length > 0 && (
          <p className="text-center text-sm text-muted-foreground">
            <Link
              to="/organizer"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Manage events in Organizer Panel
            </Link>
          </p>
        )}
      </div>
    )
  }

  const registeredEvents = registeredIds
    .map((id) => resolveEventById(id, createdEvents))
    .filter((e): e is NonNullable<typeof e> => e != null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          My Events
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Events you&apos;ve registered for.
        </p>
      </div>

      {registeredEvents.length === 0 ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-gradient-to-b from-muted/30 to-card/50 px-6 py-16 text-center shadow-inner">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
            <CalendarPlus className="size-8" aria-hidden />
          </div>
          <h2 className="font-heading mt-6 text-xl font-semibold tracking-tight text-foreground">
            No events registered yet
          </h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Explore events and register for ones you want to attend.
          </p>
          <div className="mt-8">
            <Link
              to="/events"
              className={cn(
                buttonVariants({ variant: 'default', size: 'lg' }),
                'h-11 rounded-xl gap-2 px-6 shadow-md shadow-indigo-500/20',
              )}
            >
              <Sparkles className="size-4" />
              Explore events
            </Link>
          </div>
        </div>
      ) : (
        <ul className="space-y-3">
          {registeredEvents.map((ev) => (
            <li key={ev.id}>
              <EventPreviewRow event={ev} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
