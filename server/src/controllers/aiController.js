import { suggestMealPlan, suggestGroceries, spendingInsight } from '../services/aiFeatures.js';
import { successResponse } from '../utils/apiResponse.js';

export async function mealPlan(req, res) { return successResponse(res, await suggestMealPlan(req.user._id, req.body), 'Meal suggestion ready.'); }
export async function groceries(req, res) { return successResponse(res, await suggestGroceries(req.user._id, req.body), 'Grocery suggestion ready.'); }
export async function insight(req, res) { return successResponse(res, await spendingInsight(req.user._id, req.body), 'Spending insight ready.'); }
