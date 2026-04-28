import { type FormEvent, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { EVENT_CATEGORIES } from '@/data/mockEvents'
import { useCreatedEvents } from '@/hooks/useCreatedEvents'
import { cn } from '@/lib/utils'
import type { EventCategory } from '@/types/event'



type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  organizerEmail: string
}

export function CreateEventSheet({ open, onOpenChange, organizerEmail }: Props) {
  const { addCreatedEvent } = useCreatedEvents()
  const [title, setTitle] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [timeLabel, setTimeLabel] = useState('')
  const [venue, setVenue] = useState('')
  const [category, setCategory] = useState<EventCategory | ''>('')
  const [description, setDescription] = useState('')
  const [capacityRaw, setCapacityRaw] = useState('')

  function reset() {
    setTitle('')
    setStartDate('')
    setEndDate('')
    setTimeLabel('')
    setVenue('')
    setCategory('')
    setDescription('')
    setCapacityRaw('')
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim() || !startDate || !endDate || !timeLabel.trim() || !venue.trim() || !category || !description.trim()) {
      toast.error('Please fill in all required fields.')
      return
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error('End date cannot be before start date.')
      return
    }

    const cap = capacityRaw.trim()
    let capacity: number | undefined
    if (cap === '') {
      capacity = undefined
    } else {
      const n = Number.parseInt(cap, 10)
      if (Number.isNaN(n) || n < 0) {
        toast.error('Capacity must be a valid number.')
        return
      }
      capacity = n
    }

    addCreatedEvent(
      {
        title: title.trim(),
        startDate,
        endDate,
        timeLabel: timeLabel.trim(),
        venue: venue.trim(),
        category: category as EventCategory,
        description: description.trim(),
        capacity,
      },
      organizerEmail,
    )
    toast.success('Event created successfully.')
    reset()
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-lg"
      >
        <SheetHeader className="border-b border-border/60 px-6 py-5 text-left">
          <SheetTitle className="font-heading text-xl">Create event</SheetTitle>
          <SheetDescription>
            Add a new campus event. It will appear in Explore Events for all
            students.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 px-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="ce-title">Title</Label>
            <Input
              id="ce-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              className="rounded-xl"
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ce-startdate">Start Date</Label>
              <Input
                id="ce-startdate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ce-enddate">End Date</Label>
              <Input
                id="ce-enddate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-xl"
                required
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="ce-time">Time</Label>
              <Input
                id="ce-time"
                value={timeLabel}
                onChange={(e) => setTimeLabel(e.target.value)}
                placeholder="e.g. 2:00 PM – 4:00 PM"
                className="rounded-xl"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ce-venue">Venue</Label>
            <Input
              id="ce-venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="Building and room"
              className="rounded-xl"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ce-category">Category</Label>
            <Select
              value={category || undefined}
              onValueChange={(v) => setCategory(v as EventCategory)}
              required
            >
              <SelectTrigger id="ce-category" className="h-10 w-full rounded-xl">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ce-desc">Description</Label>
            <textarea
              id="ce-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What should attendees know?"
              rows={4}
              required
              className={cn(
                'flex min-h-[100px] w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-colors',
                'placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
                'disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30',
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ce-cap">Capacity (optional)</Label>
            <Input
              id="ce-cap"
              type="number"
              min={0}
              inputMode="numeric"
              value={capacityRaw}
              onChange={(e) => setCapacityRaw(e.target.value)}
              placeholder="Max attendees"
              className="rounded-xl"
            />
          </div>
          <div className="mt-auto flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-primary-foreground shadow-md shadow-indigo-500/25"
            >
              Create event
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
