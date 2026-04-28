import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { EventCategory } from '@/types/event'

import { categoryBadgeClass } from './category-styles'

export function CategoryBadge({
  category,
  className,
}: {
  category: EventCategory
  className?: string
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'rounded-full border px-2.5 py-0.5 font-semibold tracking-wide',
        categoryBadgeClass[category],
        className,
      )}
    >
      {category}
    </Badge>
  )
}
