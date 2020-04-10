import { Router } from 'express';
import errorHandler from 'express-async-handler';
import * as controller from './controller';

const router = Router();

router.get('/', errorHandler(controller.getAnalytics));
router.get('/:saleId', errorHandler(controller.getSaleById));
router.patch('/:saleId', errorHandler(controller.updateSale));
router.delete('/:saleId', errorHandler(controller.softDeleteSale));

export default router;
