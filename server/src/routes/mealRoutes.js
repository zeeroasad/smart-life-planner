import { Router } from 'express';
import * as controller from '../controllers/mealController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { mealPlanSchema } from '../validators/domainSchemas.js';

const router = Router();
router.use(requireAuth);
router.get('/', asyncHandler(controller.list));
router.get('/:id', asyncHandler(controller.getOne));
router.post('/', validate(mealPlanSchema), asyncHandler(controller.create));
router.put('/:id', validate(mealPlanSchema), asyncHandler(controller.update));
router.delete('/:id', asyncHandler(controller.remove));
export default router;
