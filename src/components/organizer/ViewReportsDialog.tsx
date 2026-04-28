import { AlertTriangle, AlertCircle } from 'lucide-react'
import { useEffect, useMemo } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAuth } from '@/hooks/useAuth'
import { getReportsByEvent } from '@/lib/reportStorage'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventId: string
  eventTitle: string
}

export function ViewReportsDialog({
  open,
  onOpenChange,
  eventId,
  eventTitle,
}: Props) {
  const { user } = useAuth()

  const reports = useMemo(() => {
    return getReportsByEvent(eventId)
  }, [eventId, open])

  useEffect(() => {
    if (open && (!user || user.role !== 'organizer')) {
      onOpenChange(false)
    }
  }, [open, user, onOpenChange])

  if (!user || user.role !== 'organizer') return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90vh,calc(100dvh-2rem))] gap-0 p-0 sm:max-w-xl">
        <DialogHeader className="border-b border-border/60 px-6 py-5 text-left">
          <DialogTitle className="font-heading flex items-center gap-2 text-xl">
            <AlertTriangle className="size-5 text-destructive" />
            Event Reports
          </DialogTitle>
          <DialogDescription className="line-clamp-2">
            Viewing reports for {eventTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="flex max-h-[calc(min(90vh,calc(100dvh-2rem))-8rem)] flex-col gap-6 overflow-y-auto px-6 py-6 border-b border-border/20 bg-muted/10">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground">
              Submitted Reports ({reports.length})
            </h3>
            {reports.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-card/60 rounded-xl border border-dashed border-border/60">
                 <AlertCircle className="size-8 text-muted-foreground/40 mb-3" />
                 <p className="text-sm text-muted-foreground">No reports filed yet.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {reports.map((r, i) => (
                  <li key={i} className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 relative">
                    <p className="text-xs font-semibold text-destructive uppercase tracking-wider mb-2">Reported by: {r.userEmail}</p>
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap">{r.message}</p>
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
