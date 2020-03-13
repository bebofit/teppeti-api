import { Router } from 'express';
import errorHandler from 'express-async-handler';
import * as controller from './controller';

const router = Router();

router.get('/', errorHandler(controller.getUsers));
router.get('/:userId', errorHandler(controller.getUserById));
router.post('/', errorHandler(controller.createUser));
router.patch('/:userId', errorHandler(controller.updateUser));
router.delete('/:userId', errorHandler(controller.softDeleteUser));

export default router;
