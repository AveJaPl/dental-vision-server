// Here router for auth path is defined in src/routes/auth.ts:
import { Router, Request, Response } from 'express';
import { register, login } from '../controllers/auth.controller';
const router = Router();

router.post('/register', register);
router.post('/login', login);

export default router;