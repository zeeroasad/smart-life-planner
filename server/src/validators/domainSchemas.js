import { z } from 'zod';
import { BUDGET_CATEGORIES, DIETARY_PREFERENCES, FITNESS_GOALS, MEAL_TYPES, SUPPORTED_CURRENCIES } from '../config/constants.js';

const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);
const category = z.string().trim().min(2).max(40).refine((value) => BUDGET_CATEGORIES.includes(value), 'Choose a configured category.');
const item = z.object({ name: z.string().trim().min(1).max(120), quantity: z.coerce.number().min(0).default(1), unit: z.string().trim().max(30).default('item'), estimatedCost: z.coerce.number().min(0).default(0), checked: z.boolean().default(false) });
const meal = z.object({ mealType: z.string().refine((value) => MEAL_TYPES.includes(value), 'Choose a meal type.'), name: z.string().trim().min(1).max(120), calories: z.coerce.number().min(0).default(0), protein: z.coerce.number().min(0).default(0), carbs: z.coerce.number().min(0).default(0), fat: z.coerce.number().min(0).default(0), ingredients: z.array(z.object({ name: z.string().trim().min(1).max(120), quantity: z.coerce.number().min(0).default(1), unit: z.string().trim().max(30).default('item'), estimatedCost: z.coerce.number().min(0).default(0) })).default([]) });

export const budgetSchema = z.object({ month, category, amount: z.coerce.number().min(0).max(100000000) });
export const expenseSchema = z.object({ month, category, amount: z.coerce.number().positive().max(100000000), note: z.string().trim().max(160).default('') });
export const groceryListSchema = z.object({ name: z.string().trim().min(1).max(100), month, items: z.array(item).max(100).default([]), sourceMealPlanId: z.string().optional().nullable() });
export const groceryItemSchema = item;
export const mealPlanSchema = z.object({ title: z.string().trim().min(1).max(120), goal: z.string().refine((value) => FITNESS_GOALS.includes(value), 'Choose a configured goal.'), calorieTarget: z.coerce.number().min(500).max(10000), dietaryPreference: z.string().refine((value) => DIETARY_PREFERENCES.includes(value), 'Choose a configured dietary preference.'), allergies: z.array(z.string().trim().min(1).max(60)).max(20).default([]), meals: z.array(meal).max(20).default([]), source: z.enum(['manual', 'ai', 'fallback']).default('manual') });
export const profileSchema = z.object({ name: z.string().trim().min(2).max(80), currency: z.string().refine((value) => SUPPORTED_CURRENCIES.includes(value), 'Choose a configured currency.'), health: z.object({ goal: z.string().refine((value) => FITNESS_GOALS.includes(value)), calorieTarget: z.coerce.number().min(500).max(10000), allergies: z.array(z.string().trim().min(1).max(60)).max(20), dietaryPreference: z.string().refine((value) => DIETARY_PREFERENCES.includes(value)) }) });
