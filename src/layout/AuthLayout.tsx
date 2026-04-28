import { GraduationCap } from 'lucide-react'
import type { ReactNode } from 'react'

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* LEFT SIDE (Brand Section) */}
      <div className="hidden md:flex flex-col justify-center items-center text-center px-8 h-full bg-gradient-to-br from-indigo-500 to-purple-600">
        <div className="flex flex-col items-center max-w-md w-full">
          {/* Top Brand */}
          <div className="flex items-center gap-2 text-white text-lg font-semibold mb-6">
            <GraduationCap className="w-8 h-8" />
            <span>Campus Event Planner</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl font-bold text-white leading-tight">
            Discover & Manage Campus Events
          </h1>

          {/* Subtext */}
          <p className="text-white/80 mt-3 max-w-md">
            Your one-stop platform for exploring, organizing & attending university events
          </p>

          {/* Bottom badges */}
          <div className="flex gap-3 mt-8">
            <span className="bg-white/20 text-white px-4 py-1 rounded-full text-sm">
              500+ Events
            </span>
            <span className="bg-white/20 text-white px-4 py-1 rounded-full text-sm">
              50+ Clubs
            </span>
            <span className="bg-white/20 text-white px-4 py-1 rounded-full text-sm">
              10k Students
            </span>
          </div>
        </div>
      </div>
      
      {/* RIGHT SIDE (FORM) */}
      <div className="bg-gray-50 flex justify-center items-center p-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}
