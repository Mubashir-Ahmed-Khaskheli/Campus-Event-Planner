import { db } from '../config/firebase';
import { Event } from '../models';

export const createEvent = async (eventData: Partial<Event>, organizerId: string) => {
  const eventRef = db.collection('events').doc();
  const event: Event = {
    id: eventRef.id,
    title: eventData.title || '',
    description: eventData.description || '',
    category: eventData.category || '',
    capacity: eventData.capacity || 0,
    startDate: eventData.startDate || new Date().toISOString(),
    endDate: eventData.endDate || new Date().toISOString(),
    createdBy: organizerId,
    createdAt: new Date(),
  };

  await eventRef.set(event);
  return event;
};

export const updateEvent = async (eventId: string, eventData: Partial<Event>, organizerId: string) => {
  const eventRef = db.collection('events').doc(eventId);
  const doc = await eventRef.get();
  
  if (!doc.exists) throw new Error('Event not found');
  if (doc.data()?.createdBy !== organizerId) throw new Error('Unauthorized: You can only edit your own events');

  await eventRef.update({
    ...eventData,
    // prevent updating restricted fields
    id: eventId,
    createdBy: organizerId
  });

  return (await eventRef.get()).data();
};

export const deleteEvent = async (eventId: string, organizerId: string) => {
  const eventRef = db.collection('events').doc(eventId);
  const doc = await eventRef.get();
  
  if (!doc.exists) throw new Error('Event not found');
  if (doc.data()?.createdBy !== organizerId) throw new Error('Unauthorized: You can only delete your own events');

  await eventRef.delete();
  return { success: true, eventId };
};

export const getAllEvents = async (): Promise<Event[]> => {
  const snapshot = await db.collection('events').get();
  return snapshot.docs.map(doc => doc.data() as Event);
};

export const getEventById = async (eventId: string) => {
  const doc = await db.collection('events').doc(eventId).get();
  if (!doc.exists) throw new Error('Event not found');
  
  return doc.data() as Event;
};
