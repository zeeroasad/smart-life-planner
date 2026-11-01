import { z } from 'zod';
import { DIETARY_PREFERENCES, FITNESS_GOALS } from '../config/constants.js';

export const aiMealSchema = z.object({ goal: z.string().refine((value) => FITNESS_GOALS.includes(value)), calorieTarget: z.coerce.number().min(500).max(10000), allergies: z.array(z.string().trim().min(1).max(60)).max(20), dietaryPreference: z.string().refine((value) => DIETARY_PREFERENCES.includes(value)) });
export const aiGrocerySchema = z.object({ meals: z.array(z.object({ name: z.string().max(120), ingredients: z.array(z.object({ name: z.string().max(120), quantity: z.coerce.number().min(0), unit: z.string().max(30), estimatedCost: z.coerce.number().min(0) })) })).max(20) });
export const aiInsightSchema = z.object({ currency: z.string().max(10), budgets: z.array(z.object({ category: z.string().max(40), budgeted: z.coerce.number().min(0), spent: z.coerce.number().min(0) })).max(30) });
