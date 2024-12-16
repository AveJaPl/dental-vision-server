import { Router, Request, Response } from 'express';
import auth from './auth';
import analyze from './analyze';
const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the API' });
});
router.use('/auth', auth)
router.use('/analyze', analyze)

export default router;
