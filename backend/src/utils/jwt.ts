import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const signAccessToken = (payload: any) => {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as any });
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, env.JWT_SECRET);
};