import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'

import { EventCard } from '@/components/events/EventCard'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EVENT_CATEGORIES } from '@/data/mockEvents'
import { useCreatedEvents } from '@/hooks/useCreatedEvents'
import { listBrowseEvents } from '@/lib/resolve-event'
import type { EventCategory } from '@/types/event'

export function EventsPage() {
  const { createdEvents } = useCreatedEvents()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<'all' | EventCategory>('all')
  const [day, setDay] = useState<'all' | 'today' | 'tomorrow' | 'this_week'>('all')
  const [time, setTime] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all')

  const allEvents = useMemo(
    () => listBrowseEvents(createdEvents),
    [createdEvents],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrowStart = new Date(todayStart)
    tomorrowStart.setDate(tomorrowStart.getDate() + 1)
    const afterTomorrowStart = new Date(tomorrowStart)
    afterTomorrowStart.setDate(afterTomorrowStart.getDate() + 1)
    
    const weekStart = new Date(todayStart)
    const dayOfWeek = weekStart.getDay() // 0 = Sunday
    weekStart.setDate(weekStart.getDate() - dayOfWeek)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 7)

    return allEvents.filter((e) => {
      const matchesTitle = !q || e.title.toLowerCase().includes(q)
      const matchesCat = category === 'all' || e.category === category

      let matchesDay = true
      if (day !== 'all') {
        // Treat event date locally to match current day correctly
        // The date string usually parsed locally based on time if we just pass date component
        // but simple `new Date(e.startDate || e.dateLabel || '')` works for parsing most ISO/standard dates.
        let evDate = new Date(e.startDate || e.dateLabel || '')
        // If evDate is invalid but dateLabel exists
        if (isNaN(evDate.getTime()) && e.dateLabel) {
          evDate = new Date(e.dateLabel)
        }

        if (!isNaN(evDate.getTime())) {
          // normalize evDate to local start of day to avoid timezone cutoff issues
          const normalizedEvDate = new Date(evDate.getFullYear(), evDate.getMonth(), evDate.getDate())
          if (day === 'today') {
             matchesDay = normalizedEvDate.getTime() === todayStart.getTime()
          } else if (day === 'tomorrow') {
             matchesDay = normalizedEvDate.getTime() === tomorrowStart.getTime()
          } else if (day === 'this_week') {
             matchesDay = normalizedEvDate >= weekStart && normalizedEvDate < weekEnd
          }
        }
      }

      let matchesTime = true
      if (time !== 'all' && e.timeLabel) {
        const timeMatch = e.timeLabel.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
        if (timeMatch) {
          let hours = parseInt(timeMatch[1], 10)
          const isPM = timeMatch[3].toUpperCase() === 'PM'
          if (isPM && hours < 12) hours += 12
          if (!isPM && hours === 12) hours = 0

          if (time === 'morning') {
            matchesTime = hours < 12
          } else if (time === 'afternoon') {
            matchesTime = hours >= 12 && hours < 17
          } else if (time === 'evening') {
            matchesTime = hours >= 17
          }
        }
      }

      return matchesTitle && matchesCat && matchesDay && matchesTime
    })
  }, [query, category, day, time, allEvents])

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm sm:p-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Explore Events
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Browse campus happenings—workshops, sports, seminars, and more.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
          <div className="space-y-2 lg:col-span-1">
            <Label htmlFor="event-search" className="text-sm font-medium">
              Search by title
            </Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="event-search"
                type="search"
                placeholder="Search events…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-11 rounded-xl pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-category" className="text-sm font-medium">
              Category
            </Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as 'all' | EventCategory)}
            >
              <SelectTrigger id="event-category" className="h-11 rounded-xl">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {EVENT_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-day" className="text-sm font-medium">
              Day filter
            </Label>
            <Select value={day} onValueChange={(v: any) => setDay(v)}>
              <SelectTrigger id="event-day" className="h-11 rounded-xl">
                <SelectValue placeholder="All Dates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="this_week">This Week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-time" className="text-sm font-medium">
              Time filter
            </Label>
            <Select value={time} onValueChange={(v: any) => setTime(v)}>
              <SelectTrigger id="event-time" className="h-11 rounded-xl">
                <SelectValue placeholder="Any Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Time</SelectItem>
                <SelectItem value="morning">Morning (Before 12 PM)</SelectItem>
                <SelectItem value="afternoon">Afternoon (12 PM - 5 PM)</SelectItem>
                <SelectItem value="evening">Evening (After 5 PM)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 px-6 py-16 text-center">
          <p className="font-heading text-lg font-semibold text-foreground">
            No events match your filters
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting search or category.
          </p>
        </div>
      ) : (
        <ul className="grid list-none gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <li key={event.id} className="min-h-0">
              <EventCard event={event} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
