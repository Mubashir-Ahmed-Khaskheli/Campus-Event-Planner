import 'dotenv/config'; // Load env variables first
import express from 'express';
import cors from 'cors';

import { requireAuth, requireRole } from './middleware/auth.middleware';
import * as authController from './controllers/auth.controller';
import * as eventController from './controllers/event.controller';
import * as taskController from './controllers/task.controller';
// Removed standalone realtime service since Cloud triggers will handle background tasks

import * as reportController from './controllers/report.controller';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// -- ROUTES --

// Auth Routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/sync', requireAuth, authController.syncRole);

// Event Routes
app.get('/api/events', eventController.getAll);
app.get('/api/events/:id', eventController.getSingle);
app.post('/api/events', requireAuth, requireRole('organizer'), eventController.create);
app.put('/api/events/:id', requireAuth, requireRole('organizer'), eventController.update);
app.delete('/api/events/:id', requireAuth, requireRole('organizer'), eventController.remove);

// Registration & Feedback Routes
app.post('/api/events/:id/register', requireAuth, requireRole('student'), eventController.register);
app.get('/api/events/:id/participants', requireAuth, eventController.getParticipants);
app.post('/api/events/:id/feedback', requireAuth, requireRole('student'), eventController.addFeedback);

// Task Routes
app.get('/api/events/:eventId/tasks', requireAuth, taskController.getEventTasks);
app.post('/api/tasks', requireAuth, requireRole('organizer'), taskController.create);
app.put('/api/tasks/:id/done', requireAuth, taskController.markDone);
app.delete('/api/tasks/:id', requireAuth, requireRole('organizer'), taskController.remove);

// Reports
app.post('/api/events/:eventId/reports', requireAuth, reportController.create);
app.get('/api/events/:eventId/reports', requireAuth, requireRole('organizer'), reportController.getEventReports);

// Add a basic health check
app.get('/', (req, res) => {
  res.send('Campus Event Planner Backend is Running');
});

// Export the express app instead of calling app.listen()
export default app;
