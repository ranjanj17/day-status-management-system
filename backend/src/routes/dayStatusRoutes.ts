import { Router } from 'express';
import * as dayStatusController from '../controllers/dayStatusController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/', dayStatusController.getStatuses);
router.get('/:date', dayStatusController.getStatusByDate);
router.put('/:date', authenticate, dayStatusController.updateStatus);

export default router;
