import { Router } from 'express';
import * as controller from '../controllers/accountController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { profileSchema } from '../validators/domainSchemas.js';

const router = Router();
router.use(requireAuth);
router.put('/profile', validate(profileSchema), asyncHandler(controller.profile));
router.get('/export', asyncHandler(controller.exportData));
router.delete('/', asyncHandler(controller.removeAccount));
export default router;
