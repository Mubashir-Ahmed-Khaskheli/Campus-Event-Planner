import type { EventCategory } from '@/types/event'

export const categoryBadgeClass: Record<EventCategory, string> = {
  Tech: 'border-indigo-200/80 bg-indigo-50 text-indigo-800 dark:border-indigo-500/30 dark:bg-indigo-950/60 dark:text-indigo-100',
  Sports:
    'border-emerald-200/80 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-950/60 dark:text-emerald-100',
  Workshop:
    'border-amber-200/80 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/50 dark:text-amber-100',
  Seminar:
    'border-violet-200/80 bg-violet-50 text-violet-800 dark:border-violet-500/30 dark:bg-violet-950/60 dark:text-violet-100',
  Cultural:
    'border-pink-200/80 bg-pink-50 text-pink-800 dark:border-pink-500/30 dark:bg-pink-950/60 dark:text-pink-100',
}
