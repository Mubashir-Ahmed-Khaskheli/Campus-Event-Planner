import * as functions from 'firebase-functions/v1';

// 1. Export the Express API
// All routes will be available at: /api
import app from './server';
export const api = functions.https.onRequest(app);

// 2. Export Auth Triggers
import { syncUserOnCreate } from './functions/userTrigger';
export const onUserCreated = syncUserOnCreate;

// 3. Export Scheduled Jobs
import { checkOverdueTasks } from './functions/taskScheduler';
export const scheduledTaskSweep = checkOverdueTasks;
