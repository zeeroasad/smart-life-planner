import { Router } from 'express';
import * as controller from '../controllers/authController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { authRateLimiter } from '../middleware/rateLimiters.js';
import { registerSchema, loginSchema, resetRequestSchema, resetConfirmSchema } from '../validators/authSchemas.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.post('/register', authRateLimiter, validate(registerSchema), asyncHandler(controller.register));
router.post('/login', authRateLimiter, validate(loginSchema), asyncHandler(controller.login));
router.post('/refresh', asyncHandler(controller.refresh));
router.post('/logout', asyncHandler(controller.logout));
router.post('/password-reset/request', authRateLimiter, validate(resetRequestSchema), asyncHandler(controller.requestReset));
router.post('/password-reset/confirm', authRateLimiter, validate(resetConfirmSchema), asyncHandler(controller.confirmReset));
router.get('/me', requireAuth, asyncHandler(controller.me));
export default router;
