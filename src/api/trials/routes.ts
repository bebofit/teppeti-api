import { Router } from 'express';
import errorHandler from 'express-async-handler';
import * as controller from './controller';

const router = Router();

router.get('/', errorHandler(controller.getTrials));
router.get('/:trialId', errorHandler(controller.getTrialById));
router.post('/', errorHandler(controller.createTrail));
router.post('/accept/:trialId', errorHandler(controller.acceptTrial));
router.patch('/:trialId', errorHandler(controller.updateTrial));
router.delete('/:trialId', errorHandler(controller.softDeleteTrial));

export default router;
