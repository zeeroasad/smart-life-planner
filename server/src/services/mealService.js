import { MealPlan } from '../models/MealPlan.js';
import { ServiceError } from '../utils/serviceError.js';

export function calculateTotals(meals = []) {
  return meals.reduce((totals, meal) => ({ calories: totals.calories + meal.calories, protein: totals.protein + meal.protein, carbs: totals.carbs + meal.carbs, fat: totals.fat + meal.fat }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
}

export async function listMealPlans(userId) {
  const plans = await MealPlan.find({ userId }).sort({ createdAt: -1 }).lean();
  return plans.map((plan) => ({ ...plan, id: plan._id.toString() }));
}

export async function getMealPlan(userId, id) {
  const plan = await MealPlan.findOne({ _id: id, userId });
  if (!plan) throw new ServiceError(404, 'MEAL_PLAN_NOT_FOUND', 'Meal plan not found.');
  return { ...plan.toObject(), id: plan._id.toString() };
}

export async function createMealPlan(userId, input) {
  const plan = await MealPlan.create({ userId, ...input, totals: calculateTotals(input.meals) });
  return getMealPlan(userId, plan._id);
}

export async function updateMealPlan(userId, id, input) {
  const plan = await MealPlan.findOneAndUpdate({ _id: id, userId }, { ...input, totals: calculateTotals(input.meals) }, { new: true, runValidators: true });
  if (!plan) throw new ServiceError(404, 'MEAL_PLAN_NOT_FOUND', 'Meal plan not found.');
  return getMealPlan(userId, id);
}

export async function deleteMealPlan(userId, id) {
  const deleted = await MealPlan.findOneAndDelete({ _id: id, userId });
  if (!deleted) throw new ServiceError(404, 'MEAL_PLAN_NOT_FOUND', 'Meal plan not found.');
}
