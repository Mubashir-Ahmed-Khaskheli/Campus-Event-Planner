import { Request, Response, NextFunction } from 'express';
import { auth, db } from '../config/firebase';
import { UserRole } from '../models';

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    role: UserRole;
  };
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid Bearer token' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await auth.verifyIdToken(token);
    
    // Fetch the user's role from Firestore
    // Note: We could use Custom Claims to save a DB read, but since it's asked to store in Firestore:
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    
    if (!userDoc.exists) {
       return res.status(401).json({ error: 'Unauthorized: User record not found' });
    }

    const userData = userDoc.data();
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: userData?.role as UserRole
    };

    next();
  } catch (error) {
    console.error('Auth Verification Error:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export const requireRole = (role: UserRole) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: User not found in request' });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ error: `Forbidden: Requires ${role} role` });
    }

    next();
  };
};
