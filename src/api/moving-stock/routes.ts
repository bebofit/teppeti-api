import { Router } from 'express';
import errorHandler from 'express-async-handler';
import * as controller from './controller';

const router = Router();

router.get('/sender', errorHandler(controller.getMovingStocksBySender));
router.get('/receiver', errorHandler(controller.getMovingStocksByReceiver));
router.get('/:movingStockId', errorHandler(controller.getMovingStockById));
router.post('/', errorHandler(controller.createMovingStock));
router.post(
  '/accept/:movingStockId',
  errorHandler(controller.acceptMovingStock)
);
router.delete(
  '/:movingStockId',
  errorHandler(controller.softDeleteMovingStock)
);

export default router;
