// Here router for analyze path is defined in src/routes/analyze.ts:
import { Router, Request, Response } from 'express';
import { getUserData } from '../controllers/user.controller';
const router = Router();

router.post('/', getUserData);

export default router;