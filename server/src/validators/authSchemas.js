import { z } from 'zod';

const password = z.string().min(8).max(100);
export const registerSchema = z.object({ name: z.string().trim().min(2).max(80), email: z.string().trim().email().max(160), password });
export const loginSchema = z.object({ email: z.string().trim().email(), password: z.string().min(1).max(100) });
export const resetRequestSchema = z.object({ email: z.string().trim().email() });
export const resetConfirmSchema = z.object({ token: z.string().min(20), password });
