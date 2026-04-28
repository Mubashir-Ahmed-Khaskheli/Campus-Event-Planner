import { Bookmark, CalendarClock, MapPin, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import { useAuth } from '@/hooks/useAuth'
import { useUserEvents } from '@/hooks/useUserEvents'
import { cn, getEventDateDisplay } from '@/lib/utils'
import type { CampusEvent } from '@/types/event'
import { buttonVariants } from '@/components/ui/button'

import { CategoryBadge } from './CategoryBadge'

export function EventCard({
  event,
  className,
}: {
  event: CampusEvent
  className?: string
}) {
  const { user } = useAuth()
  const { isBookmarked, toggleBookmark } = useUserEvents()
  const isOrganizer = user?.role === 'organizer'
  const bookmarked = !isOrganizer && isBookmarked(event.id)

  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-md border border-gray-100 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl',
        className,
      )}
    >
      {/* Top Image Placeholder / Gradient */}
      <div className="h-32 w-full bg-gradient-to-br from-indigo-100 to-purple-100" />
      
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <CategoryBadge category={event.category} />
          {!isOrganizer && (
            <button
              type="button"
              aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark event'}
              aria-pressed={bookmarked}
              onClick={() => toggleBookmark(event.id)}
              className={cn(
                'rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 xl:-mt-2',
                bookmarked && 'text-indigo-600',
              )}
            >
              <Bookmark
                className="size-5"
                fill={bookmarked ? 'currentColor' : 'none'}
              />
            </button>
          )}
        </div>

        <h2 className="mt-3 font-heading text-xl font-bold leading-snug tracking-tight text-gray-900 group-hover:text-indigo-600 transition-colors">
          {event.title}
        </h2>

        <div className="mt-3 space-y-2 text-sm text-gray-500">
          <p className="flex items-start gap-2">
            <CalendarClock className="size-4 shrink-0 text-indigo-500" />
            <span>
              {getEventDateDisplay(event.dateLabel, event.startDate, event.endDate)}
              <span className="text-gray-400 mx-1">·</span>
              {event.timeLabel}
            </span>
          </p>
          <p className="flex items-start gap-2">
            <MapPin className="size-4 shrink-0 text-indigo-500" />
            <span className="leading-snug">{event.venue}</span>
          </p>
        </div>

        <p className="mt-4 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600">
          {event.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {event.capacity != null && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600">
              <Users className="size-3.5" aria-hidden />
              Capacity {event.capacity}
            </span>
          )}
        </div>

        <div className="mt-6">
          <Link
            to={`/events/${event.id}`}
            className={cn(buttonVariants({ variant: 'default' }), "w-full")}
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  )
}
