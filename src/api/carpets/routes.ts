import { Router } from 'express';
import errorHandler from 'express-async-handler';
import { isSuperAdmin, uploadCarpetPhoto } from '../../common/middleware';
import * as controller from './controller';

const router = Router();

router.get('/all', isSuperAdmin, errorHandler(controller.getAllCarepts));
router.get('/sold', isSuperAdmin, errorHandler(controller.getSoldCarepts));
router.get('/', errorHandler(controller.getCarpetsByBranch));
router.get('/:carpetId', errorHandler(controller.getCarpetById));
router.post('/', errorHandler(controller.addCarpet));
router.patch(
  '/:carpetId/photo',
  uploadCarpetPhoto,
  errorHandler(controller.updatePhoto)
);
router.post('/sell/:carpetId', errorHandler(controller.sellCarpet));
router.patch('/:carpetId', errorHandler(controller.updateCarpet));
router.delete('/:carpetId', errorHandler(controller.softDeleteCarpet));

export default router;
