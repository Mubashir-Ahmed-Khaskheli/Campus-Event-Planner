import { CalendarClock, ChevronRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

import { CategoryBadge } from '@/components/events/CategoryBadge'
import { cn, getEventDateDisplay } from '@/lib/utils'
import type { CampusEvent } from '@/types/event'

export function EventPreviewRow({
  event,
  className,
}: {
  event: CampusEvent
  className?: string
}) {
  return (
    <Link
      to={`/events/${event.id}`}
      className={cn(
        'group flex items-start gap-4 rounded-xl border border-border/60 bg-card/60 p-4 shadow-sm transition-colors hover:border-primary/25 hover:bg-muted/30',
        className,
      )}
    >
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge category={event.category} />
        </div>
        <h3 className="font-heading text-base font-semibold leading-snug text-foreground group-hover:text-primary">
          {event.title}
        </h3>
        <div className="flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3">
          <span className="inline-flex items-center gap-1.5">
            <CalendarClock className="size-3.5 shrink-0 text-primary/80" />
            {getEventDateDisplay(event.dateLabel, event.startDate, event.endDate)}
            <span className="text-foreground/50">·</span>
            {event.timeLabel}
          </span>
          <span className="inline-flex items-start gap-1.5 sm:items-center">
            <MapPin className="mt-0.5 size-3.5 shrink-0 text-primary/80 sm:mt-0" />
            <span className="leading-snug">{event.venue}</span>
          </span>
        </div>
      </div>
      <ChevronRight
        className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
        aria-hidden
      />
    </Link>
  )
}
