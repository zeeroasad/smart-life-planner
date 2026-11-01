import { Router } from 'express';
import * as controller from '../controllers/adminController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth, requireAdmin);
router.get('/accounts', asyncHandler(controller.accounts));
router.post('/accounts/:id/disable', asyncHandler(controller.disable));
router.post('/accounts/:id/enable', asyncHandler(controller.enable));
export default router;
