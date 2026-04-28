import { db } from '../config/firebase';

/**
 * Realtime listeners hosted on the Backend.
 * 
 * In a traditional Firebase app, you would listen to `onSnapshot` on the frontend.
 * However, if backend needs to react immediately without HTTP polls:
 */
export const initRealtimeListeners = () => {
  console.log('Initializing Real-Time Listeners...');

  // 1. Listen for new events
  db.collection('events').onSnapshot(
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          console.log('[Realtime] New event created: ', change.doc.data().title);
          // Could trigger email notifications, etc.
        }
      });
    },
    (err) => {
      console.error(`[Realtime] Event listener error: ${err}`);
    }
  );

  // 2. Listen for tasks to auto-mark as overdue or notify dueSoon
  db.collection('tasks').where('status', '==', 'pending').onSnapshot(
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        // Here you could calculate if a task is 'dueSoon' and emit a WebSocket event
        // or send an email/push notification to the volunteer.
        if (change.type === 'added' || change.type === 'modified') {
           console.log(`[Realtime] Task update detected: ${change.doc.id}`);
        }
      });
    }
  );

  // 3. Listen for registrations to monitor event capacity actively
  db.collection('registrations').onSnapshot(
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
           console.log(`[Realtime] New registration for event: ${change.doc.data().eventId}`);
        }
      });
    }
  );
};
