import { db } from '../config/firebase';
import { Task } from '../models';
import { calculateTaskTiming, sortTasks } from '../utils/helpers';

export const createTask = async (taskData: Omit<Task, 'id' | 'status' | 'completedAt'>) => {
  // Validate that the assigned user is a volunteer for this event
  const regDoc = await db.collection('registrations').doc(`${taskData.eventId}_${taskData.assignedTo}`).get();
  
  if (!regDoc.exists || regDoc.data()?.role !== 'volunteer') {
    throw new Error('Task can only be assigned to a registered volunteer of this event');
  }

  const taskRef = db.collection('tasks').doc();
  const task: Task = {
    ...taskData,
    id: taskRef.id,
    status: 'pending',
    completedAt: null
  };

  await taskRef.set(task);
  return task;
};

export const markTaskDone = async (taskId: string, userId: string, userRole: string) => {
  const taskRef = db.collection('tasks').doc(taskId);
  const doc = await taskRef.get();

  if (!doc.exists) throw new Error('Task not found');
  
  const task = doc.data() as Task;

  if (userRole !== 'organizer' && task.assignedTo !== userId) {
    throw new Error('Unauthorized: Only assigned volunteer or organizer can mark as done');
  }

  const updatedTask = {
    ...task,
    status: 'done' as const,
    completedAt: new Date()
  };

  await taskRef.update(updatedTask);
  
  // Return the logic required (onTime, late, lateBy)
  return calculateTaskTiming(updatedTask);
};

export const deleteTask = async (taskId: string) => {
  await db.collection('tasks').doc(taskId).delete();
  return { success: true };
};

export const getTasksForEvent = async (eventId: string): Promise<Task[]> => {
  const snapshot = await db.collection('tasks').where('eventId', '==', eventId).get();
  const tasks = snapshot.docs.map(doc => doc.data() as Task);

  // Auto-calculate overdue just before returning
  const now = new Date();
  const updatedTasks = tasks.map(task => {
    if (task.status !== 'done') {
      let deadline = task.deadline;
      if ((deadline as any).toDate) deadline = (deadline as any).toDate();
      else if (!(deadline instanceof Date)) deadline = new Date(deadline);

      if (deadline.getTime() < now.getTime() && task.status !== 'overdue') {
        task.status = 'overdue';
        // Fire and forget updating the document in firestore
        db.collection('tasks').doc(task.id).update({ status: 'overdue' }).catch(console.error);
      }
    }
    return task;
  });

  return sortTasks(updatedTasks);
};
