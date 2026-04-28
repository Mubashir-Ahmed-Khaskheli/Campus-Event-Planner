import { db } from '../config/firebase';
import { Report } from '../models';

export const submitReport = async (eventId: string, userId: string, message: string) => {
  const reportRef = db.collection('reports').doc();
  const report: Report = {
    id: reportRef.id,
    eventId,
    userId,
    message,
    createdAt: new Date()
  };

  await reportRef.set(report);
  return report;
};

export const getReportsForEvent = async (eventId: string) => {
  const snapshot = await db.collection('reports').where('eventId', '==', eventId).get();
  return snapshot.docs.map(doc => doc.data() as Report);
};
