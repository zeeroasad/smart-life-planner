import { z } from 'zod';
import { AiCache } from '../models/AiCache.js';
import { config } from '../config/env.js';
import { AI_DISCLAIMER } from '../config/constants.js';
import { requestJson } from './aiProvider.js';
import { stableHash } from '../utils/stableHash.js';

const mealDraftSchema = z.object({ title: z.string().min(1).max(120), meals: z.array(z.object({ mealType: z.string(), name: z.string(), calories: z.number().nonnegative(), protein: z.number().nonnegative(), carbs: z.number().nonnegative(), fat: z.number().nonnegative(), ingredients: z.array(z.object({ name: z.string(), quantity: z.number().nonnegative(), unit: z.string(), estimatedCost: z.number().nonnegative() })) })).max(20) });
const groceryDraftSchema = z.object({ items: z.array(z.object({ name: z.string(), quantity: z.number().nonnegative(), unit: z.string(), estimatedCost: z.number().nonnegative(), checked: z.boolean().default(false) })).max(100) });
const insightSchema = z.object({ headline: z.string().min(1).max(120), summary: z.string().min(1).max(500), tips: z.array(z.string().max(180)).max(4) });

async function cached(userId, feature, input, producer) {
  const inputHash = stableHash(input);
  const existing = await AiCache.findOne({ userId, feature, inputHash, expiresAt: { $gt: new Date() } }).lean();
  if (existing) return existing.result;
  const result = await producer();
  await AiCache.findOneAndUpdate({ userId, feature, inputHash }, { result, expiresAt: new Date(Date.now() + config.ai.cacheHours * 60 * 60 * 1000) }, { upsert: true, new: true });
  return result;
}

function fallbackMeal(input) {
  // FR-07: the no-key path still respects the minimum dietary inputs.
  const scale = input.calorieTarget / 2000;
  const preference = input.dietaryPreference;
  const blocked = input.allergies.map((allergy) => allergy.toLowerCase());
  const isBlocked = (name) => blocked.some((allergy) => name.includes(allergy) || (allergy.includes('dairy') && name.includes('yogurt')) || (allergy.includes('milk') && name.includes('yogurt')) || (allergy.includes('nut') && name.includes('peanut')));
  const safeIngredients = (ingredients) => ingredients.filter((ingredient) => !isBlocked(ingredient.name));
  const breakfastDairy = preference === 'vegan' ? { name: 'soy yogurt', quantity: 1, unit: 'cup', estimatedCost: 190 } : { name: 'plain yogurt', quantity: 1, unit: 'cup', estimatedCost: 160 };
  const lunchProtein = preference === 'vegan' ? { name: 'chickpeas', quantity: 1, unit: 'cup', estimatedCost: 180 } : preference === 'vegetarian' ? { name: 'paneer', quantity: 120, unit: 'g', estimatedCost: 320 } : { name: 'chicken breast', quantity: 180, unit: 'g', estimatedCost: 420 };
  const meals = [
    { mealType: 'breakfast', name: 'Oats, yogurt and fruit', calories: Math.round(420 * scale), protein: 20, carbs: 58, fat: 12, ingredients: safeIngredients([{ name: 'rolled oats', quantity: 1, unit: 'cup', estimatedCost: 180 }, breakfastDairy, { name: 'banana', quantity: 1, unit: 'item', estimatedCost: 60 }]) },
    { mealType: 'lunch', name: `${preference === 'vegan' ? 'Chickpea' : preference === 'vegetarian' ? 'Paneer' : 'Chicken'} grain bowl`, calories: Math.round(620 * scale), protein: 42, carbs: 68, fat: 18, ingredients: safeIngredients([lunchProtein, { name: 'brown rice', quantity: 1, unit: 'cup', estimatedCost: 140 }, { name: 'mixed vegetables', quantity: 2, unit: 'cup', estimatedCost: 220 }]) },
    { mealType: 'dinner', name: 'Lentil vegetable curry', calories: Math.round(560 * scale), protein: 24, carbs: 74, fat: 14, ingredients: safeIngredients([{ name: 'lentils', quantity: 1, unit: 'cup', estimatedCost: 180 }, { name: 'tomatoes', quantity: 3, unit: 'item', estimatedCost: 120 }, { name: 'spinach', quantity: 2, unit: 'cup', estimatedCost: 160 }]) },
    { mealType: 'snack', name: 'Apple and seed spread', calories: Math.round(220 * scale), protein: 7, carbs: 28, fat: 10, ingredients: safeIngredients([{ name: 'apple', quantity: 1, unit: 'item', estimatedCost: 100 }, { name: 'sunflower seed spread', quantity: 1, unit: 'tbsp', estimatedCost: 90 }]) }
  ];
  return { title: `${input.goal} starter plan`, meals };
}

export async function suggestMealPlan(userId, input) {
  return cached(userId, 'meal-plan', input, async () => {
    const raw = await requestJson({ model: config.ai.modelSmart, system: 'Return only JSON. Create a practical meal plan. Respect the calorie target, goal, allergies, and dietary preference. Do not mention medical claims.', user: JSON.stringify(input) });
    const parsed = mealDraftSchema.safeParse(raw);
    return { ...(parsed.success ? parsed.data : fallbackMeal(input)), source: parsed.success ? 'ai' : 'fallback', disclaimer: AI_DISCLAIMER };
  });
}

export async function suggestGroceries(userId, input) {
  return cached(userId, 'grocery-list', input, async () => {
    const fallback = { items: input.meals.flatMap((meal) => meal.ingredients).reduce((items, ingredient) => { const key = `${ingredient.name.toLowerCase()}|${ingredient.unit}`; const found = items.find((item) => item.key === key); if (found) found.quantity += ingredient.quantity; else items.push({ key, name: ingredient.name, quantity: ingredient.quantity, unit: ingredient.unit, estimatedCost: ingredient.estimatedCost, checked: false }); return items; }, []).map(({ key, ...item }) => item) };
    const raw = await requestJson({ model: config.ai.modelFast, system: 'Return only JSON with an items array. Aggregate duplicate grocery ingredients and use sensible estimated costs in PKR.', user: JSON.stringify(input) });
    const parsed = groceryDraftSchema.safeParse(raw);
    return { ...(parsed.success ? parsed.data : fallback), source: parsed.success ? 'ai' : 'fallback', disclaimer: AI_DISCLAIMER };
  });
}

export async function spendingInsight(userId, input) {
  return cached(userId, 'spending-insight', input, async () => {
    const fallback = { headline: 'Keep your plan visible', summary: 'Your grocery estimate is now included in the Groceries budget. Review the remaining amount before your next shop.', tips: ['Set a realistic Groceries budget before generating the next list.', 'Use checked items as a simple progress marker.'] };
    const raw = await requestJson({ model: config.ai.modelFast, system: 'Return only JSON with headline, summary, and tips. Give a short neutral spending observation using only the provided category totals.', user: JSON.stringify(input) });
    const parsed = insightSchema.safeParse(raw);
    return { ...(parsed.success ? parsed.data : fallback), source: parsed.success ? 'ai' : 'fallback' };
  });
}
