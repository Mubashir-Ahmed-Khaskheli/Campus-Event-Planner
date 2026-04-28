import { db } from '../config/firebase';
import { Registration, RegistrationRole } from '../models';

export const registerToEvent = async (
  eventId: string,
  userId: string,
  userData: { name: string; email: string; phone: string; role: RegistrationRole }
) => {
  const eventRef = db.collection('events').doc(eventId);
  const registrationRef = db.collection('registrations').doc(`${eventId}_${userId}`);

  return await db.runTransaction(async (t) => {
    // 1. Check if event exists and get capacity
    const eventDoc = await t.get(eventRef);
    if (!eventDoc.exists) {
      throw new Error('Event does not exist');
    }

    // 2. Check if already registered
    const regDoc = await t.get(registrationRef);
    if (regDoc.exists) {
      throw new Error('User is already registered for this event');
    }

    // 3. Enforce capacity limit
    const capacity = eventDoc.data()?.capacity || 0;
    
    // Get current registration count using aggregation query (or counting docs)
    // Running a count inside a transaction isn't direct, so we read all registrations for the event
    // For large scale, use a counter field in the event document instead
    const registrationsSnapshot = await t.get(db.collection('registrations').where('eventId', '==', eventId));
    const currentCount = registrationsSnapshot.docs.length;

    if (currentCount >= capacity) {
      throw new Error('Event is at full capacity');
    }

    // 4. Create registration
    const registration: Registration = {
      id: registrationRef.id,
      eventId,
      userId,
      ...userData,
      createdAt: new Date()
    };

    t.set(registrationRef, registration);

    return registration;
  });
};

export const getEventParticipants = async (eventId: string, requesterRole: string) => {
  const snapshot = await db.collection('registrations').where('eventId', '==', eventId).get();
  
  const participants = snapshot.docs.map(doc => doc.data() as Registration);

  if (requesterRole === 'organizer') {
    return participants;
  } else {
    // Students only get count + optional names
    return {
      count: participants.length,
      names: participants.map(p => p.name)
    };
  }
};
