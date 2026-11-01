import { GroceryList } from '../models/GroceryList.js';
import { MealPlan } from '../models/MealPlan.js';
import { ServiceError } from '../utils/serviceError.js';

export function calculateListTotal(list) {
  return list.items.reduce((sum, item) => sum + (item.estimatedCost || 0) * (item.quantity || 1), 0);
}

export async function listGroceryLists(userId, month) {
  const filter = { userId, ...(month ? { month } : {}) };
  const lists = await GroceryList.find(filter).sort({ createdAt: -1 }).lean();
  return lists.map((list) => ({ ...list, id: list._id.toString(), estimatedTotal: calculateListTotal(list) }));
}

export async function getGroceryList(userId, id) {
  const list = await GroceryList.findOne({ _id: id, userId });
  if (!list) throw new ServiceError(404, 'GROCERY_NOT_FOUND', 'Grocery list not found.');
  return { ...list.toObject(), id: list._id.toString(), estimatedTotal: calculateListTotal(list) };
}

export async function createGroceryList(userId, input) {
  const list = await GroceryList.create({ userId, ...input });
  return getGroceryList(userId, list._id);
}

export async function updateGroceryList(userId, id, input) {
  const list = await GroceryList.findOneAndUpdate({ _id: id, userId }, input, { new: true, runValidators: true });
  if (!list) throw new ServiceError(404, 'GROCERY_NOT_FOUND', 'Grocery list not found.');
  return getGroceryList(userId, id);
}

export async function deleteGroceryList(userId, id) {
  const deleted = await GroceryList.findOneAndDelete({ _id: id, userId });
  if (!deleted) throw new ServiceError(404, 'GROCERY_NOT_FOUND', 'Grocery list not found.');
}

export async function createFromMealPlan(userId, mealPlanId, name, month) {
  const mealPlan = await MealPlan.findOne({ _id: mealPlanId, userId }).lean();
  if (!mealPlan) throw new ServiceError(404, 'MEAL_PLAN_NOT_FOUND', 'Meal plan not found.');
  const merged = new Map();
  for (const meal of mealPlan.meals) for (const ingredient of meal.ingredients || []) {
    const key = `${ingredient.name.toLowerCase()}|${ingredient.unit}`;
    const current = merged.get(key);
    if (current) current.quantity += ingredient.quantity || 0;
    else merged.set(key, { ...ingredient });
  }
  return createGroceryList(userId, { name: name || `${mealPlan.title} groceries`, month, sourceMealPlanId: mealPlan._id, items: [...merged.values()] });
}
