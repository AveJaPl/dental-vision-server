// Here router for analyze path is defined in src/routes/analyze.ts:
import { Router, Request, Response } from 'express';
import { analyze } from '../controllers/analyze.controller';
import { upload } from '../utils/mutler';
const router = Router();

router.post('/', upload.array('images', 10), analyze);

export default router;