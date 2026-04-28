import { cn } from '@/lib/utils'
import type { EnhancedTask } from '@/lib/task-utils'

export function TaskStatusBadge({
  status,
  className,
}: {
  status: EnhancedTask['statusOverride']
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        status === 'Done'
          ? 'border-emerald-300/80 bg-emerald-50 text-emerald-900 dark:border-emerald-500/40 dark:bg-emerald-950/50 dark:text-emerald-100'
          : status === 'Overdue'
            ? 'border-red-300/80 bg-red-100 text-red-600 dark:border-red-500/40 dark:bg-red-950/40 dark:text-red-100'
          : status === 'Due Soon'
            ? 'border-yellow-300/80 bg-yellow-100 text-yellow-700 dark:border-yellow-500/40 dark:bg-yellow-950/40 dark:text-yellow-100'
            : 'border-amber-300/80 bg-amber-50 text-amber-950 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-100',
        className,
      )}
    >
      {status}
    </span>
  )
}
