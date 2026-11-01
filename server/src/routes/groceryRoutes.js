import { Router } from 'express';
import * as controller from '../controllers/groceryController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { groceryListSchema } from '../validators/domainSchemas.js';
import { z } from 'zod';

const router = Router();
router.use(requireAuth);
router.get('/', asyncHandler(controller.list));
router.get('/:id', asyncHandler(controller.getOne));
router.post('/', validate(groceryListSchema), asyncHandler(controller.create));
router.put('/:id', validate(groceryListSchema), asyncHandler(controller.update));
router.delete('/:id', asyncHandler(controller.remove));
router.post('/from-meal-plan', validate(z.object({ mealPlanId: z.string(), name: z.string().trim().max(100).optional(), month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/) })), asyncHandler(controller.fromMeal));
export default router;
