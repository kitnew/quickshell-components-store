import { Router } from 'express';
import { register, login, me } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { registerSchema, loginSchema } from '../validators/auth.schemas'

const router = Router();

router.post('/register', validate(registerSchema), register);

router.post('/login', validate(loginSchema), login);

router.get('/me', authMiddleware, me);

export default router;