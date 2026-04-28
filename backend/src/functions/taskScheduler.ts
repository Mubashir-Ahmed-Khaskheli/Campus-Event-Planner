import * as functions from 'firebase-functions/v1';
import { db } from '../config/firebase';
import { Task } from '../models';

/**
 * Scheduled function running every 5 minutes to automatically sweep tasks
 * and mark their status as "overdue" if the deadline has passed.
 */
export const checkOverdueTasks = functions.pubsub.schedule('every 5 minutes').onRun(async (context) => {
  console.log('[taskScheduler] Running overdue task sweep sweep...');

  const now = new Date();

  // We query all tasks that are currently "pending"
  // Note: To optimize further in production, consider querying where deadline < now, 
  // but Firestore inequality filters can be restrictive.
  const snapshot = await db.collection('tasks').where('status', '==', 'pending').get();

  const batch = db.batch();
  let overdueCount = 0;

  snapshot.forEach((doc) => {
    const task = doc.data() as Task;
    // Safely parse Firestore Timestamp or Date strings
    let deadlineDate = task.deadline;
    if ((deadlineDate as any).toDate) {
      deadlineDate = (deadlineDate as any).toDate();
    } else if (!(deadlineDate instanceof Date)) {
      deadlineDate = new Date(deadlineDate); // fallback
    }

    if (deadlineDate.getTime() < now.getTime()) {
      batch.update(doc.ref, { status: 'overdue' });
      overdueCount++;
    }
  });

  if (overdueCount > 0) {
    await batch.commit();
    console.log(`[taskScheduler] Automatically marked ${overdueCount} tasks as overdue.`);
  } else {
    console.log(`[taskScheduler] No new overdue tasks found.`);
  }
});
