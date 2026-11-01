import { Router } from 'express';
import * as controller from '../controllers/aiController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { aiRateLimiter } from '../middleware/rateLimiters.js';
import { aiMealSchema, aiGrocerySchema, aiInsightSchema } from '../validators/aiSchemas.js';

const router = Router();
router.use(requireAuth, aiRateLimiter);
router.post('/meal-plan', validate(aiMealSchema), asyncHandler(controller.mealPlan));
router.post('/groceries', validate(aiGrocerySchema), asyncHandler(controller.groceries));
router.post('/spending-insight', validate(aiInsightSchema), asyncHandler(controller.insight));
export default router;
