import { auth, db } from '../config/firebase';
import { UserRole } from '../models';

export const registerUser = async (email: string, password: string, name: string) => {
  let role: UserRole;

  if (email.endsWith('@students.muet.edu.pk')) {
    role = 'student';
  } else if (email.endsWith('@organizer.muet.edu.pk')) {
    role = 'organizer';
  } else {
    throw new Error('Invalid email domain. Must be @students.muet.edu.pk or @organizer.muet.edu.pk');
  }

  // Create user in Firebase Auth
  const userRecord = await auth.createUser({
    email,
    password,
    displayName: name,
  });

  // Store user role and details in Firestore
  await db.collection('users').doc(userRecord.uid).set({
    id: userRecord.uid,
    name,
    email,
    role,
    createdAt: new Date(),
  });

  // Also set custom claims just in case it's needed for other rules
  await auth.setCustomUserClaims(userRecord.uid, { role });

  return { uid: userRecord.uid, email, role, name };
};

export const syncUserRole = async (uid: string) => {
  // If user signed up via client UI instead of our backend endpoint,
  // we could sync their role based on email.
  const userRecord = await auth.getUser(uid);
  if (!userRecord.email) throw new Error('User has no email');

  let role: UserRole;
  if (userRecord.email.endsWith('@students.muet.edu.pk')) {
    role = 'student';
  } else if (userRecord.email.endsWith('@organizer.muet.edu.pk')) {
    role = 'organizer';
  } else {
    // Revert creation if invalid domain
    await auth.deleteUser(uid);
    throw new Error('Invalid email domain. User deleted.');
  }

  const doc = await db.collection('users').doc(uid).get();
  if (!doc.exists) {
    await db.collection('users').doc(uid).set({
      id: uid,
      name: userRecord.displayName || '',
      email: userRecord.email,
      role,
      createdAt: new Date(),
    });
    await auth.setCustomUserClaims(uid, { role });
  }

  return role;
};
