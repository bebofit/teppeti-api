import { Router } from 'express';
import { isAuthenticated } from '../common/middleware';
import authRoutes from './auth';
import carpetsRoutes from './carpets';
import clientsRoutes from './clients';
import movingStocksRoutes from './moving-stock';
import trailsRoutes from './trials';
import usersRoutes from './users';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/carpets', isAuthenticated, carpetsRoutes);
router.use('/clients', isAuthenticated, clientsRoutes);
router.use('/moving-stocks', isAuthenticated, movingStocksRoutes);
router.use('/trials', isAuthenticated, trailsRoutes);

export default router;
