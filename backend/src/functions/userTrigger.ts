import * as functions from 'firebase-functions/v1';
import { auth, db } from '../config/firebase';
import { UserRole } from '../models';
import * as admin from 'firebase-admin';

export const syncUserOnCreate = functions.auth.user().onCreate(async (user) => {
  console.log(`[userTrigger] New user signed up: ${user.uid} (${user.email})`);

  const email = user.email;

  if (!email) {
    console.error("[userTrigger] No email found");
    return;
  }

  let role: UserRole;

  // 🔐 STRICT EMAIL VALIDATION (FIXED)
  if (email.endsWith('@organizer.muet.edu.pk')) {
    role = 'organizer';
  } else if (email.endsWith('@students.muet.edu.pk')) {
    role = 'student';
  } else {
    console.warn(`[userTrigger] Unauthorized email: ${email}`);

    // ❌ DELETE INVALID USER (IMPORTANT)
    await auth.deleteUser(user.uid);

    return;
  }

  // 🔐 SET CUSTOM CLAIMS
  await auth.setCustomUserClaims(user.uid, { role });

  // 💾 STORE IN FIRESTORE (BEST PRACTICE TIMESTAMP)
  await db.collection('users').doc(user.uid).set({
    id: user.uid,
    name: user.displayName || '',
    email,
    role,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log(`[userTrigger] User ${user.uid} initialized as ${role}`);
});