export type UserRole = 'student' | 'organizer'

export interface User {
  fullName: string
  email: string
  role: UserRole
}
