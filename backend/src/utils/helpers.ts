import { Task } from '../models';

/**
 * Returns a countdown string or status for a given deadline.
 */
export const getCountdown = (deadlineRaw: Date | string | any): string => {
  const now = new Date();
  
  // Handle Firestore Timestamps and date strings
  let deadline = deadlineRaw;
  if (deadlineRaw && typeof deadlineRaw.toDate === 'function') {
    deadline = deadlineRaw.toDate();
  } else if (!(deadline instanceof Date)) {
    deadline = new Date(deadlineRaw);
  }

  const diffMs = deadline.getTime() - now.getTime();
  
  if (diffMs <= 0) {
    return 'Overdue';
  }

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffDays > 0) return `${diffDays}d ${diffHours}h remaining`;
  if (diffHours > 0) return `${diffHours}h ${diffMins}m remaining`;
  return `${diffMins}m remaining`;
};

/**
 * Categorize the lateness of a task based on its completedAt vs deadline.
 */
export const calculateTaskTiming = (task: Task) => {
  if (!task.completedAt) return { status: 'pending' };
  
  let deadline = task.deadline;
  if ((deadline as any).toDate) deadline = (deadline as any).toDate();
  else if (!(deadline instanceof Date)) deadline = new Date(deadline);

  let completedAt = task.completedAt;
  if ((completedAt as any).toDate) completedAt = (completedAt as any).toDate();
  else if (!(completedAt instanceof Date)) completedAt = new Date(completedAt);

  const diffMs = completedAt.getTime() - deadline.getTime();
  
  if (diffMs <= 0) {
    return { status: 'onTime' };
  }

  const lateHours = Math.floor(diffMs / (1000 * 60 * 60));
  const lateMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return {
    status: 'late',
    lateBy: `${lateHours}h ${lateMins}m`
  };
};

/**
 * Custom sort tasks:
 * 1. overdue (deadline passed, not done)
 * 2. dueSoon (deadline <= 1 hour, not done)
 * 3. pending (deadline > 1 hour, not done)
 * 4. done (completed)
 */
export const sortTasks = (tasks: Task[]): Task[] => {
  const now = new Date();
  
  const getSortWeight = (task: Task) => {
    if (task.status === 'done') return 4;
    
    let deadline = task.deadline;
    if ((deadline as any).toDate) deadline = (deadline as any).toDate();
    else if (!(deadline instanceof Date)) deadline = new Date(deadline);
    
    const diffMs = deadline.getTime() - now.getTime();
    
    if (task.status === 'overdue' || diffMs <= 0) return 1;
    
    // dueSoon: <= 1 hour (3600000 ms)
    if (diffMs <= 3600000) return 2;
    
    return 3;
  };

  return tasks.sort((a, b) => getSortWeight(a) - getSortWeight(b));
};
