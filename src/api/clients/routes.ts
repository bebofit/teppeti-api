import { Router } from 'express';
import errorHandler from 'express-async-handler';
import * as controller from './controller';

const router = Router();

router.get('/', errorHandler(controller.getClients));
router.get('/search', errorHandler(controller.searchClients));
router.get('/:clientId', errorHandler(controller.getClientById));
router.post('/', errorHandler(controller.createClient));
router.patch('/:clientId', errorHandler(controller.updateClient));
router.delete('/:clientId', errorHandler(controller.softDeleteClient));

export default router;
