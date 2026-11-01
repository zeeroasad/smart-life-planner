import rateLimit from 'express-rate-limit';
import { config } from '../config/env.js';

const standard = { standardHeaders: true, legacyHeaders: false };
export const authRateLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, ...standard, message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many authentication requests. Try again later.' } } });
export const aiRateLimiter = rateLimit({ windowMs: config.ai.rateWindowMs, limit: config.ai.rateMax, ...standard, message: { success: false, error: { code: 'AI_RATE_LIMITED', message: 'AI requests are temporarily limited. Try again later.' } } });
