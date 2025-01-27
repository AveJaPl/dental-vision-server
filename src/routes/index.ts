import { Router, Request, Response } from 'express';
import auth from './auth';
import analyze from './analyze';
import user from "./user"
const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the API' });
});
router.use('/auth', auth)
router.use('/analyze', analyze)
router.use('/user', user)

export default router;
