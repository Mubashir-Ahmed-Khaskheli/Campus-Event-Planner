export type EventCategory = 'Tech' | 'Sports' | 'Seminar' | 'Workshop' | 'Cultural'

export interface CampusEvent {
  id: string
  title: string
  description: string
  dateLabel?: string
  startDate?: string
  endDate?: string
  timeLabel: string
  venue: string
  category: EventCategory
  capacity?: number
}

export interface OrganizerCreatedEvent extends CampusEvent {
  organizerEmail: string
}
