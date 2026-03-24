import { z } from 'zod';

export const registerSchema = z.object({
    username: z.string().min(3).max(255),
    email: z.email(),
    password: z.string().min(6).max(255),
});

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6).max(255),
});