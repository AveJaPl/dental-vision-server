// Here router for analyze path is defined in src/routes/analyze.ts:
import { Router, Request, Response } from 'express';
import { analyze } from '../controllers/analyze.controller';

const router = Router();

router.post('/', analyze);

export default router;