import { Router } from 'express';
import authRoutes from './auth';
import usersRoutes from './users';
import carpetsRoutes from './carpets';
import movingStocksRoutes from './moving-stock';
import { isAuthenticated } from '../common/middleware';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/carpets', isAuthenticated, carpetsRoutes);
router.use('/moving-stocks', isAuthenticated, movingStocksRoutes);

export default router;
