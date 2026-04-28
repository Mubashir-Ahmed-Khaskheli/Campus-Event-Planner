import { Request, Response } from 'express';
import { createTask, markTaskDone, deleteTask, getTasksForEvent } from '../services/task.service';

export const create = async (req: Request, res: Response) => {
  try {
    const task = await createTask(req.body);
    res.status(201).json(task);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const markDone = async (req: Request, res: Response) => {
  try {
    const result = await markTaskDone(req.params.id, (req as any).user.uid, (req as any).user.role);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const result = await deleteTask(req.params.id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getEventTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await getTasksForEvent(req.params.eventId);
    res.status(200).json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
