import { Request, Response } from 'express';
import { registerUser, syncUserRole } from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
       return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const user = await registerUser(email, password, name);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const syncRole = async (req: Request, res: Response) => {
  try {
    // Requires Auth Middleware to be active on this route
    const uid = (req as any).user?.uid;
    if (!uid) return res.status(401).json({ error: 'Not authenticated' });
    
    const role = await syncUserRole(uid);
    res.status(200).json({ role });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
