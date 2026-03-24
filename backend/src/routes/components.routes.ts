import { Router } from 'express';
import {
    createComponent,
    getAllComponents,
    getComponentById,
    updateComponent,
    deleteComponent
} from '../controllers/components.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createComponentSchema, updateComponentSchema } from '../validators/component.schemas';

const router = Router();

// Public routes
router.get('/', getAllComponents);
router.get('/:id', getComponentById);

// Protected routes
router.post('/', authMiddleware, validate(createComponentSchema), createComponent);
router.put('/:id', authMiddleware, validate(updateComponentSchema), updateComponent);
router.delete('/:id', authMiddleware, deleteComponent);

export default router;