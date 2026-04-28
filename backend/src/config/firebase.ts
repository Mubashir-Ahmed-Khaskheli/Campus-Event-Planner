import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// More robust way to load the service account key dynamically locally
const keyPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
let credential;

if (fs.existsSync(keyPath)) {
  credential = admin.credential.cert(require(keyPath));
} else {
  console.warn("⚠️ Warning: serviceAccountKey.json not found in backend directory. Admin SDK will rely on application default credentials, which may fail locally.");
}

admin.initializeApp({
  credential,
  projectId: "campus-event-planner-4a80a"
});

export const db = admin.firestore();
export const auth = admin.auth();
