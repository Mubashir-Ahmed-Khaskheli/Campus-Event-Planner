import { db } from '../config/firebase';
import { Feedback } from '../models';

export const submitFeedback = async (
  eventId: string, 
  userId: string, 
  rating: number, 
  comment: string
) => {
  // 1. Verify user is registered for the event
  const regRef = db.collection('registrations').doc(`${eventId}_${userId}`);
  const regDoc = await regRef.get();

  if (!regDoc.exists) {
    throw new Error('You must be registered for this event to leave feedback');
  }

  // 2. Ensure feedback is only submitting once per user/event
  const feedbackRef = db.collection('feedback').doc(`${eventId}_${userId}`);
  const feedbackDoc = await feedbackRef.get();

  if (feedbackDoc.exists) {
    throw new Error('You have already submitted feedback for this event');
  }

  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  const feedback: Feedback = {
    id: feedbackRef.id,
    eventId,
    userId,
    rating,
    comment,
    createdAt: new Date()
  };

  await feedbackRef.set(feedback);
  return feedback;
};
