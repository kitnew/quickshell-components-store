import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = verifyAccessToken(token);
        // Cast to any to avoid TypeScript property error, 
        // as Express Request doesn't include 'user' by default
        (req as any).user = payload;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized: invalid or expired token' });
    }
};
