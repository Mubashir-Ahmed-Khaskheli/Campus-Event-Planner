import { Request, Response } from 'express';
import { submitReport, getReportsForEvent } from '../services/report.service';

export const create = async (req: Request, res: Response) => {
  try {
    const report = await submitReport(req.params.eventId, (req as any).user.uid, req.body.message);
    res.status(201).json(report);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getEventReports = async (req: Request, res: Response) => {
  try {
    // Already protected by requireRole('organizer') in the route
    const reports = await getReportsForEvent(req.params.eventId);
    res.status(200).json(reports);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
