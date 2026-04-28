import {
  ArrowLeft,
  Bookmark,
  CalendarClock,
  Check,
  MapPin,
  Users,
  AlertTriangle,
  Star,
} from 'lucide-react'
import { type FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { CategoryBadge } from '@/components/events/CategoryBadge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { getEventDateDisplay } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { useCreatedEvents } from '@/hooks/useCreatedEvents'
import { useUserEvents, getRegistrationsByEvent } from '@/hooks/useUserEvents'
import { addFeedback, getFeedbackByEvent } from '@/lib/feedbackStorage'
import { addReport } from '@/lib/reportStorage'
import { resolveEventById } from '@/lib/resolve-event'

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { createdEvents } = useCreatedEvents()
  const { isBookmarked, isRegistered, toggleBookmark, registerForEvent } =
    useUserEvents()
  const event = id ? resolveEventById(id, createdEvents) : undefined
  const isOrganizer = user?.role === 'organizer'
  const bookmarked = event && !isOrganizer ? isBookmarked(event.id) : false
  const registered = event && !isOrganizer ? isRegistered(event.id) : false

  const [registerOpen, setRegisterOpen] = useState(false)
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regRole, setRegRole] = useState<'attendee' | 'volunteer'>('attendee')

  const [reportOpen, setReportOpen] = useState(false)
  const [reportMessage, setReportMessage] = useState('')

  const [feedbackRating, setFeedbackRating] = useState(0)
  const [feedbackComment, setFeedbackComment] = useState('')

  const eventRegs = event ? getRegistrationsByEvent(event.id) : []
  const attendeesCount = eventRegs.filter(r => r.role === 'attendee').length
  const volunteersCount = eventRegs.filter(r => r.role === 'volunteer').length

  const feedbacks = event ? getFeedbackByEvent(event.id) : []
  const hasFeedback = user && feedbacks.some(f => f.userEmail === user.email)
  const avgRating = feedbacks.length
    ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
    : 'No ratings yet'

  useEffect(() => {
    if (registerOpen && user) {
      setRegName(user.fullName ?? '')
      setRegEmail(user.email ?? '')
    }
  }, [registerOpen, user])

  function handleReportSubmit(e: FormEvent) {
    e.preventDefault()
    if (!event || !user || isOrganizer) return
    if (!reportMessage.trim()) return
    addReport({ eventId: event.id, userEmail: user.email, message: reportMessage.trim() })
    setReportMessage('')
    setReportOpen(false)
    toast.success('Report submitted successfully to the organizers.')
  }

  function handleFeedbackSubmit(e: FormEvent) {
    e.preventDefault()
    if (!event || !user || isOrganizer || !registered) return
    if (feedbackRating < 1 || feedbackRating > 5) {
      toast.error('Please select a star rating.')
      return
    }
    if (!feedbackComment.trim()) {
      toast.error('Please write a comment.')
      return
    }
    addFeedback({ eventId: event.id, userEmail: user.email, rating: feedbackRating, comment: feedbackComment.trim() })
    toast.success('Thank you for your feedback!')
    setFeedbackRating(0)
    setFeedbackComment('')
  }

  function closeRegisterModal() {
    setRegisterOpen(false)
  }

  function handleRegisterSubmit(e: FormEvent) {
    e.preventDefault()
    if (!event || isOrganizer) return
    const name = regName.trim()
    const email = regEmail.trim()
    const phone = regPhone.trim()
    if (!name) {
      toast.error('Please enter your name.')
      return
    }
    if (!email.includes('@')) {
      toast.error('Please enter a valid email address.')
      return
    }
    if (phone.length < 10) {
      toast.error('Please enter a valid phone number (at least 10 digits).')
      return
    }
    const ok = registerForEvent(event.id, { name, email, role: regRole, phone })
    if (!ok) {
      toast.error(
        'You are already registered for this event with this email.',
      )
      return
    }
    closeRegisterModal()
    toast.success('You are registered for this event.')
  }

  if (!event) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card/80 p-8 text-center shadow-sm">
        <h1 className="font-heading text-2xl font-bold">Event not found</h1>
        <p className="mt-2 text-muted-foreground">
          This event may have been removed or the link is incorrect.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6 gap-2 rounded-xl"
          onClick={() => navigate('/events')}
        >
          <ArrowLeft className="size-4" />
          Back to events
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to Explore Events
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/90 shadow-lg shadow-indigo-500/5">
        <div className="border-b border-border/60 bg-gradient-to-r from-indigo-500/10 via-violet-500/5 to-teal-500/10 px-6 py-8 sm:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <CategoryBadge category={event.category} />
              <h1 className="font-heading max-w-3xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {event.title}
              </h1>
            </div>
            {!isOrganizer && (
              <Button
                type="button"
                variant={bookmarked ? 'secondary' : 'outline'}
                size="icon"
                className="shrink-0 rounded-xl"
                aria-pressed={bookmarked}
                aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark event'}
                onClick={() => toggleBookmark(event.id)}
              >
                <Bookmark
                  className="size-5"
                  fill={bookmarked ? 'currentColor' : 'none'}
                />
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-8 px-6 py-8 sm:px-10 lg:grid-cols-[1fr_320px] lg:gap-12">
          <div className="space-y-6">
            <section>
              <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                About
              </h2>
              <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-foreground/90">
                {event.description}
              </p>
            </section>

            <section className="pt-8 border-t border-border/60">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-xl font-bold text-foreground">
                  Feedback & Reviews
                </h2>
                <div className="flex items-center gap-2">
                   <Star className="size-5 fill-amber-400 text-amber-400" />
                   <span className="font-semibold">{avgRating}</span>
                   {feedbacks.length > 0 && <span className="text-muted-foreground text-sm">({feedbacks.length})</span>}
                </div>
              </div>

              {feedbacks.length > 0 ? (
                <ul className="space-y-4 mb-8">
                  {feedbacks.map((f, i) => {
                    const authorReg = eventRegs.find(r => r.email === f.userEmail)
                    const authorName = authorReg ? authorReg.name : 'Unknown Participant'
                    
                    return (
                      <li key={i} className="rounded-xl border border-border/40 bg-muted/20 p-5">
                        <div className="flex flex-col mb-3">
                          <p className="text-sm font-semibold text-foreground">
                            {authorName}
                          </p>
                          {isOrganizer && (
                            <p className="text-xs text-muted-foreground">
                              {f.userEmail}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`size-4 ${star <= f.rating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{f.comment}</p>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground mb-8">No feedback has been submitted for this event yet.</p>
              )}

              {user && !isOrganizer && registered && !hasFeedback && (
                <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
                  <h3 className="font-semibold text-foreground mb-4">Leave Feedback</h3>
                  <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Rating</Label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setFeedbackRating(star)}
                            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                          >
                            <Star
                              className={`size-6 ${star <= feedbackRating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted hover:text-amber-400/60'}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fb-comment">Comment</Label>
                      <Textarea
                        id="fb-comment"
                        value={feedbackComment}
                        onChange={(e) => setFeedbackComment(e.target.value)}
                        placeholder="What did you think of the event?"
                        className="rounded-xl"
                        rows={3}
                        required
                      />
                    </div>
                    <Button type="submit" className="rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-primary-foreground shadow-md">
                      Submit Feedback
                    </Button>
                  </form>
                </div>
              )}
              {hasFeedback && (
                <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-5 text-center text-sm font-medium text-muted-foreground">
                  🎉 Thank you for sharing your feedback!
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border border-border/60 bg-muted/30 p-5">
              <h2 className="font-heading text-sm font-semibold text-foreground">
                When & where
              </h2>
              <ul className="mt-4 space-y-4 text-sm">
                <li className="flex gap-3">
                  <CalendarClock className="mt-0.5 size-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">
                      {getEventDateDisplay(event.dateLabel, event.startDate, event.endDate)}
                    </p>
                    <p className="text-muted-foreground">{event.timeLabel}</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Venue</p>
                    <p className="text-muted-foreground">{event.venue}</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Users className="mt-0.5 size-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Capacity</p>
                    <p className="text-muted-foreground">
                      {event.capacity != null
                        ? `${event.capacity} attendees`
                        : 'Open / flexible'}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 bg-muted/30 p-5">
                <h2 className="font-heading text-sm font-semibold text-foreground mb-4">
                  Attendees ({attendeesCount})
                </h2>
                {attendeesCount === 0 ? (
                  <p className="text-xs text-muted-foreground">No attendees yet.</p>
                ) : (
                  <ul className="space-y-1.5 pl-1 text-sm font-medium text-foreground/80">
                    {eventRegs
                      .filter((r) => r.role === 'attendee')
                      .map((a) => (
                        <li key={`att-${a.email}`} className="flex items-center gap-2">
                          <div className="size-1.5 shrink-0 rounded-full bg-primary/40" />
                          <span className="truncate">{a.name}</span>
                        </li>
                      ))}
                  </ul>
                )}
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/30 p-5">
                <h2 className="font-heading text-sm font-semibold text-foreground mb-4">
                  Volunteers ({volunteersCount})
                </h2>
                {volunteersCount === 0 ? (
                  <p className="text-xs text-muted-foreground">No volunteers yet.</p>
                ) : (
                  <ul className="space-y-1.5 pl-1 text-sm font-medium text-foreground/80">
                    {eventRegs
                      .filter((r) => r.role === 'volunteer')
                      .map((v) => (
                        <li key={`vol-${v.email}`} className="flex items-center gap-2">
                          <div className="size-1.5 shrink-0 rounded-full bg-primary/40" />
                          <span className="truncate">{v.name}</span>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/30 p-5">
              <p className="text-xs text-muted-foreground">Category</p>
              <div className="mt-2">
                <CategoryBadge category={event.category} />
              </div>
            </div>

            {isOrganizer ? (
              <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-4 text-sm text-muted-foreground">
                Organizers manage listings from the{' '}
                <Link
                  to="/organizer"
                  className="font-medium text-primary hover:underline"
                >
                  Organizer Panel
                </Link>
                .
              </div>
            ) : (
              <>
                <Button
                  type="button"
                  size="lg"
                  disabled={registered}
                  className="h-11 w-full gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-primary-foreground shadow-md shadow-indigo-500/25 hover:brightness-105 disabled:opacity-90"
                  onClick={() => {
                    if (!registered) setRegisterOpen(true)
                  }}
                >
                  {registered ? (
                    <>
                      <Check className="size-4" />
                      Registered
                    </>
                  ) : (
                    'Register'
                  )}
                </Button>

                <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
                  <DialogContent className="max-w-md gap-0 p-0 sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="font-heading">
                        Event registration
                      </DialogTitle>
                      <DialogDescription>
                        Complete the form to register for{' '}
                        <span className="font-medium text-foreground/90">
                          {event.title}
                        </span>
                        .
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      id="event-registration-form"
                      onSubmit={handleRegisterSubmit}
                      className="flex flex-col"
                    >
                      <div className="space-y-4 px-6 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="erf-name">Name</Label>
                          <Input
                            id="erf-name"
                            name="name"
                            autoComplete="name"
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            placeholder="Your full name"
                            required
                            className="h-10 rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Register As</Label>
                          <div className="flex items-center gap-6 pt-1">
                            <label className="flex items-center gap-2 text-sm">
                              <input
                                type="radio"
                                name="role"
                                value="attendee"
                                checked={regRole === 'attendee'}
                                onChange={() => setRegRole('attendee')}
                                className="size-4 accent-primary"
                              />
                              Attendee
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                              <input
                                type="radio"
                                name="role"
                                value="volunteer"
                                checked={regRole === 'volunteer'}
                                onChange={() => setRegRole('volunteer')}
                                className="size-4 accent-primary"
                              />
                              Volunteer
                            </label>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="erf-email">Email</Label>
                          <Input
                            id="erf-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            placeholder="you@university.edu"
                            required
                            className="h-10 rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="erf-phone">Phone Number</Label>
                          <Input
                            id="erf-phone"
                            name="phone"
                            type="tel"
                            autoComplete="tel"
                            value={regPhone}
                            onChange={(e) => setRegPhone(e.target.value)}
                            placeholder="+1 (555) 000-0000"
                            required
                            minLength={10}
                            className="h-10 rounded-xl"
                          />
                        </div>
                      </div>
                      <DialogFooter className="border-t border-border/60 bg-muted/20 px-6 py-4 sm:justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-xl"
                          onClick={closeRegisterModal}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-primary-foreground shadow-md"
                        >
                          Submit
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                {registered && (
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl mt-4"
                      onClick={() => setReportOpen(true)}
                    >
                      <AlertTriangle className="size-4" />
                      Report Event
                    </Button>

                    <Dialog open={reportOpen} onOpenChange={setReportOpen}>
                      <DialogContent className="max-w-md gap-0 p-0 sm:max-w-md">
                        <DialogHeader className="px-6 py-5 border-b border-border/60 text-left">
                          <DialogTitle className="font-heading flex items-center gap-2 text-xl">
                            <AlertTriangle className="size-5 text-destructive" />
                            Report Event
                          </DialogTitle>
                          <DialogDescription>
                            Submit a report directly to the organizers. They will be notified.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleReportSubmit} className="flex flex-col">
                          <div className="space-y-4 px-6 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="rpt-msg">Report Message</Label>
                              <Textarea
                                id="rpt-msg"
                                value={reportMessage}
                                onChange={(e) => setReportMessage(e.target.value)}
                                placeholder="Describe the issue context clearly..."
                                className="rounded-xl min-h-[100px]"
                                required
                              />
                            </div>
                          </div>
                          <DialogFooter className="border-t border-border/60 bg-muted/20 px-6 py-4 sm:justify-end">
                            <Button
                              type="button"
                              variant="outline"
                              className="rounded-xl"
                              onClick={() => setReportOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              variant="destructive"
                              className="rounded-xl"
                            >
                              Submit Report
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}
