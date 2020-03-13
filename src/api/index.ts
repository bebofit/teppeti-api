import { Router } from 'express';
import authRoutes from './auth';
import usersRoutes from './users';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);

export default router;
