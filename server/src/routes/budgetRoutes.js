import { Router } from 'express';
import * as controller from '../controllers/budgetController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { budgetSchema, expenseSchema } from '../validators/domainSchemas.js';

const router = Router();
router.use(requireAuth);
router.get('/summary', asyncHandler(controller.summary));
router.post('/', validate(budgetSchema), asyncHandler(controller.upsert));
router.delete('/:id', asyncHandler(controller.remove));
router.post('/expenses', validate(expenseSchema), asyncHandler(controller.addExpense));
router.delete('/expenses/:id', asyncHandler(controller.removeExpense));
export default router;
