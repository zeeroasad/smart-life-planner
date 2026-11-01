import { MealPlan } from '../models/MealPlan.js';
import { GroceryList } from '../models/GroceryList.js';
import { getSummary } from './budgetService.js';
import { listGroceryLists } from './groceryService.js';

export async function getDashboard(user, month) {
  const [budget, groceryLists, mealPlans] = await Promise.all([getSummary(user._id, month), listGroceryLists(user._id, month), MealPlan.find({ userId: user._id }).sort({ createdAt: -1 }).limit(3).lean()]);
  return { month, currency: user.currency, budget, groceryLists, recentMealPlans: mealPlans.map((plan) => ({ id: plan._id.toString(), title: plan.title, totals: plan.totals, goal: plan.goal })) };
}
