import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';
import { dashboard } from '../controllers/dashboardController.js';

const router = Router();
router.get('/', requireAuth, asyncHandler(dashboard));
export default router;
