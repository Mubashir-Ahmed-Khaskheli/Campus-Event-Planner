import { Request, Response } from 'express';
import { createEvent, updateEvent, deleteEvent, getAllEvents, getEventById } from '../services/event.service';
import { registerToEvent, getEventParticipants } from '../services/registration.service';
import { submitFeedback } from '../services/feedback.service';

export const create = async (req: Request, res: Response) => {
  try {
    const event = await createEvent(req.body, (req as any).user.uid);
    res.status(201).json(event);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const event = await updateEvent(req.params.id, req.body, (req as any).user.uid);
    res.status(200).json(event);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const result = await deleteEvent(req.params.id, (req as any).user.uid);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const events = await getAllEvents();
    res.status(200).json(events);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getSingle = async (req: Request, res: Response) => {
  try {
    const event = await getEventById(req.params.id);
    res.status(200).json(event);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

// --- Registration & Feedback ---

export const register = async (req: Request, res: Response) => {
  try {
    const registration = await registerToEvent(req.params.id, (req as any).user.uid, req.body);
    res.status(201).json(registration);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getParticipants = async (req: Request, res: Response) => {
  try {
    const participants = await getEventParticipants(req.params.id, (req as any).user.role);
    res.status(200).json(participants);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addFeedback = async (req: Request, res: Response) => {
  try {
    const { rating, comment } = req.body;
    const feedback = await submitFeedback(req.params.id, (req as any).user.uid, rating, comment);
    res.status(201).json(feedback);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
