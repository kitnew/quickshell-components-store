import { Request, Response } from 'express';
import { registerUser, loginUser, getCurrentUser as getCurrentUserService } from '../services/auth.service';

const register = async (req: Request, res: Response) => {
    try {
        const result = await registerUser(req.body);
        res.status(201).json(result);
    } catch (error: any) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ error: error.message });
    }
}

const login = async (req: Request, res: Response) => {
    try {
        const result = await loginUser(req.body);
        res.status(200).json(result);
    } catch (error: any) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ error: error.message });
    }
}

const me = async (req: Request, res: Response) => {
    try {
        // req.user ID is typically populated by authMiddleware
        const userId = (req as any).user?.id;
        
        if (!userId) {
            return res.status(401).json({ error: 'User ID not found in request' });
        }

        const user = await getCurrentUserService(userId);
        res.status(200).json(user);
    } catch (error: any) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ error: error.message });
    }
}

export {
    register,
    login,
    me
};