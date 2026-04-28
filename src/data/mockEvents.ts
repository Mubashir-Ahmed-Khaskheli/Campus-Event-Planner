import type { CampusEvent } from '@/types/event'

export const MOCK_EVENTS: CampusEvent[] = [
  {
    id: 'evt-101',
    title: 'MUET Hackathon 2026: Build for Campus',
    category: 'Tech',
    venue: 'Innovation Lab, CS Block',
    dateLabel: 'Saturday, April 12, 2026',
    timeLabel: '9:00 AM – 9:00 PM',
    capacity: 120,
    description:
      'A 12-hour build sprint for students across departments. Form teams, pick a campus-focused problem, and ship a working prototype.',
  },
  {
    id: 'evt-102',
    title: 'Inter‑Department Cricket Cup — Finals',
    category: 'Sports',
    venue: 'Main Cricket Ground',
    dateLabel: 'Sunday, April 13, 2026',
    timeLabel: '3:30 PM – 7:00 PM',
    capacity: 800,
    description:
      'Cheer for your department as the top two cricket teams face off in the finals.',
  },
  {
    id: 'evt-103',
    title: 'Resume Clinic & Mock Interviews',
    category: 'Workshop',
    venue: 'Career Services Hall B',
    dateLabel: 'Wednesday, April 16, 2026',
    timeLabel: '10:00 AM – 2:00 PM',
    capacity: 60,
    description:
      'Bring your resume for review with alumni volunteers and optional mock interviews.',
  },
  {
    id: 'evt-104',
    title: 'Research Seminar: AI in Climate Modeling',
    category: 'Seminar',
    venue: 'EE Auditorium',
    dateLabel: 'Thursday, April 17, 2026',
    timeLabel: '4:00 PM – 5:30 PM',
    capacity: 200,
    description:
      'Guest speaker on machine learning in regional climate forecasts, with Q&A.',
  },
  {
    id: 'evt-105',
    title: 'Intro to UI Design with Figma',
    category: 'Workshop',
    venue: 'Design Studio, Architecture Block',
    dateLabel: 'Friday, April 18, 2026',
    timeLabel: '1:00 PM – 4:30 PM',
    capacity: 35,
    description:
      'Hands-on workshop covering frames, auto layout, and a simple mobile screen.',
  },
  {
    id: 'evt-106',
    title: '5‑a‑Side Futsal Tournament',
    category: 'Sports',
    venue: 'Indoor Sports Complex',
    dateLabel: 'Saturday, April 19, 2026',
    timeLabel: '8:00 AM – 6:00 PM',
    capacity: 16,
    description:
      'Fast-paced tournament with group stage and knockout rounds.',
  },
  {
    id: 'evt-107',
    title: 'Cloud & DevOps Fundamentals',
    category: 'Tech',
    venue: 'Online (Zoom) + Lab 3',
    dateLabel: 'Tuesday, April 22, 2026',
    timeLabel: '5:00 PM – 7:00 PM',
    description:
      'Overview of containers, CI/CD, and deploying a small API to the cloud.',
  },
  {
    id: 'evt-108',
    title: 'Public Speaking & Presentation Skills',
    category: 'Seminar',
    venue: 'Humanities Seminar Room 2',
    dateLabel: 'Wednesday, April 23, 2026',
    timeLabel: '11:00 AM – 1:00 PM',
    capacity: 45,
    description:
      'Interactive seminar on structuring talks and using slides effectively.',
  },
]

export const EVENT_CATEGORIES = ['Tech', 'Sports', 'Seminar', 'Workshop', 'Cultural'] as const

export function getEventById(id: string): CampusEvent | undefined {
  return MOCK_EVENTS.find((e) => e.id === id)
}
