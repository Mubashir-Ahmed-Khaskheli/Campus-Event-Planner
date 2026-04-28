import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/hooks/useAuth'
import { CreatedEventsProvider } from '@/hooks/useCreatedEvents'
import { EventTasksProvider } from '@/hooks/useEventTasks'
import { UserEventsProvider } from '@/hooks/useUserEvents'
import { MainLayout } from '@/layout/MainLayout'
import { DashboardPage } from '@/pages/DashboardPage'
import { EventDetailPage } from '@/pages/EventDetailPage'
import { EventsPage } from '@/pages/EventsPage'
import { LoginPage } from '@/pages/LoginPage'
import { MyEventsPage } from '@/pages/MyEventsPage'
import { MyTasksPage } from '@/pages/MyTasksPage'
import { OrganizerPage } from '@/pages/OrganizerPage'
import { SignupPage } from '@/pages/SignupPage'

export default function App() {
  return (
    <AuthProvider>
      <UserEventsProvider>
        <CreatedEventsProvider>
          <EventTasksProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/events/:id" element={<EventDetailPage />} />
                  <Route path="/my-events" element={<MyEventsPage />} />
                  <Route path="/my-tasks" element={<MyTasksPage />} />
                  <Route path="/organizer" element={<OrganizerPage />} />
                </Route>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
              <Toaster />
            </BrowserRouter>
          </EventTasksProvider>
        </CreatedEventsProvider>
      </UserEventsProvider>
    </AuthProvider>
  )
}
