import { LogOut, Menu, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

type NavbarProps = {
  onMenuClick?: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border/60 bg-card/80 px-4 shadow-sm backdrop-blur-md sm:h-16 sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 lg:hidden"
          aria-label="Open menu"
          onClick={onMenuClick}
        >
          <Menu className="size-5" />
        </Button>
        <Link
          to="/dashboard"
          className="truncate font-semibold tracking-tight text-foreground"
        >
          Campus Event Planner
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {user && (
          <div className="hidden min-w-0 items-center gap-2 rounded-xl border border-border/80 bg-muted/40 px-2.5 py-1 sm:flex">
            <UserRound className="size-4 shrink-0 text-primary" aria-hidden />
            <span className="truncate text-sm font-medium">{user.fullName}</span>
          </div>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5 rounded-lg"
          onClick={() => logout()}
        >
          <LogOut className="size-3.5" />
          <span className="hidden sm:inline">Log out</span>
        </Button>
      </div>
    </header>
  )
}
