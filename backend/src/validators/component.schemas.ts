import { z } from 'zod';

export const createComponentSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters long').max(255),
    description: z.string().max(2000).optional(),
    category: z.string().max(100).optional(),
    github_url: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
});

export const updateComponentSchema = createComponentSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be provided for update' }
);
