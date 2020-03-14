import { Router } from 'express';
import authRoutes from './auth';
import usersRoutes from './users';
import carpetsRoutes from './carpets';
import { isAuthenticated } from '../common/middleware';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/carpets', isAuthenticated, carpetsRoutes);

export default router;
