import { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useAuth } from '@/hooks/useAuth'

import { Navbar } from './Navbar'
import { Sidebar, SidebarNav } from './Sidebar'

export function MainLayout() {
  const { user } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-svh flex-col bg-gradient-to-br from-slate-50/90 via-background to-indigo-50/30">
      <Navbar onMenuClick={() => setMobileOpen(true)} />
      <div className="flex flex-1 min-h-0">
        <Sidebar role={user.role} />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[min(100%,20rem)] p-0">
          <SheetHeader className="border-b border-border/60 px-4 py-4 text-left">
            <SheetTitle className="text-base">Menu</SheetTitle>
          </SheetHeader>
          <SidebarNav
            role={user.role}
            onNavigate={() => setMobileOpen(false)}
            className="p-2"
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}
