import { Router } from 'express';
import authRoutes from './authRoutes';
import dayStatusRoutes from './dayStatusRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/day-status', dayStatusRoutes);
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

export default router;
