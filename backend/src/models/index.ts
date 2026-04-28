export type UserRole = 'student' | 'organizer';

export interface User {
  id: string; // Matches Firebase Auth UID
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  capacity: number;
  startDate: string; // ISO format or handled as Date/Timestamp depending on DB vs API side
  endDate: string;
  createdBy: string; // organizerId
  createdAt: Date;
}

export type RegistrationRole = 'attendee' | 'volunteer';

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: RegistrationRole;
  createdAt: Date;
}

export type TaskStatus = 'pending' | 'done' | 'overdue';

export interface Task {
  id: string;
  eventId: string;
  title: string;
  description: string;
  assignedTo: string; // userId
  deadline: Date;
  status: TaskStatus;
  completedAt: Date | null;
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}

export interface Report {
  id: string;
  eventId: string;
  userId: string;
  message: string;
  createdAt: Date;
}
