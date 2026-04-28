import {
  CalendarDays,
  LayoutDashboard,
  ListChecks,
  ListTodo,
  Shield,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

import { cn } from '@/lib/utils'
import type { UserRole } from '@/types/auth'

const baseLink =
  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted/80'

const activeLink =
  'bg-primary/10 text-primary shadow-sm ring-1 ring-primary/15'

type NavItem = {
  to: string
  label: string
  icon: ReactNode
  roles?: UserRole[]
}

const items: NavItem[] = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="size-4 shrink-0" />,
  },
  {
    to: '/events',
    label: 'Events',
    icon: <CalendarDays className="size-4 shrink-0" />,
  },
  {
    to: '/my-events',
    label: 'My Events',
    icon: <ListChecks className="size-4 shrink-0" />,
  },
  {
    to: '/my-tasks',
    label: 'My Tasks',
    icon: <ListTodo className="size-4 shrink-0" />,
    roles: ['student'],
  },
  {
    to: '/organizer',
    label: 'Organizer Panel',
    icon: <Shield className="size-4 shrink-0" />,
    roles: ['organizer'],
  },
]

function filterByRole(role: UserRole) {
  return items.filter((item) => {
    if (!item.roles) return true
    return item.roles.includes(role)
  })
}

export function SidebarNav({
  role,
  onNavigate,
  className,
}: {
  role: UserRole
  onNavigate?: () => void
  className?: string
}) {
  const visible = filterByRole(role)

  return (
    <nav className={cn('flex flex-col gap-0.5 p-2', className)}>
      {visible.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(baseLink, isActive ? activeLink : 'text-muted-foreground')
          }
        >
          {item.icon}
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export function Sidebar({ role }: { role: UserRole }) {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-border/60 bg-card/50 lg:block">
      <div className="flex h-14 items-center border-b border-border/60 px-4 sm:h-16">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Menu
        </span>
      </div>
      <SidebarNav role={role} />
    </aside>
  )
}
