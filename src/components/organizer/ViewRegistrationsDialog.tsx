import { Users } from 'lucide-react'
import { useEffect, useMemo } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAuth } from '@/hooks/useAuth'
import { getRegistrationsByEvent } from '@/hooks/useUserEvents'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventId: string
  eventTitle: string
}

export function ViewRegistrationsDialog({
  open,
  onOpenChange,
  eventId,
  eventTitle,
}: Props) {
  const { user } = useAuth()

  const allRegistrations = useMemo(() => {
    return getRegistrationsByEvent(eventId)
  }, [eventId, open])

  const attendees = allRegistrations.filter((r) => r.role === 'attendee')
  const volunteers = allRegistrations.filter((r) => r.role === 'volunteer')

  useEffect(() => {
    if (open && (!user || user.role !== 'organizer')) {
      onOpenChange(false)
    }
  }, [open, user, onOpenChange])

  if (!user || user.role !== 'organizer') {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90vh,calc(100dvh-2rem))] gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="border-b border-border/60 px-6 py-4 text-left">
          <DialogTitle className="font-heading flex items-center gap-2 text-xl">
            <Users className="size-5 text-primary" />
            Participants
          </DialogTitle>
          <DialogDescription className="line-clamp-2">
            {eventTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="flex max-h-[calc(min(90vh,calc(100dvh-2rem))-8rem)] flex-col gap-6 overflow-y-auto px-6 py-6">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground">
              Attendees ({attendees.length})
            </h3>
            {attendees.length === 0 ? (
              <p className="text-xs text-muted-foreground">No attendees registered yet.</p>
            ) : (
              <ul className="space-y-2">
                {attendees.map((a) => (
                  <li key={a.email} className="rounded-xl border border-border/60 bg-muted/20 p-3">
                    <p className="text-sm font-bold text-foreground">{a.name}</p>
                    <p className="text-xs text-muted-foreground">Email: {a.email}</p>
                    {a.phone && <p className="text-xs text-muted-foreground">Phone: {a.phone}</p>}
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                      Role: Attendee
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-3 border-t border-border/40 pt-4">
            <h3 className="text-sm font-bold text-foreground">
              Volunteers ({volunteers.length})
            </h3>
            {volunteers.length === 0 ? (
              <p className="text-xs text-muted-foreground">No volunteers registered yet.</p>
            ) : (
              <ul className="space-y-2">
                {volunteers.map((v) => (
                  <li key={v.email} className="rounded-xl border border-border/60 bg-muted/20 p-3">
                    <p className="text-sm font-bold text-foreground">{v.name}</p>
                    <p className="text-xs text-muted-foreground">Email: {v.email}</p>
                    {v.phone && <p className="text-xs text-muted-foreground">Phone: {v.phone}</p>}
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                      Role: Volunteer
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
