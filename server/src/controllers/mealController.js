import * as mealService from '../services/mealService.js';
import { AI_DISCLAIMER } from '../config/constants.js';
import { successResponse, createdResponse } from '../utils/apiResponse.js';

export async function list(req, res) { return successResponse(res, { plans: await mealService.listMealPlans(req.user._id), disclaimer: AI_DISCLAIMER }, 'Meal plans.'); }
export async function getOne(req, res) { return successResponse(res, { plan: await mealService.getMealPlan(req.user._id, req.params.id), disclaimer: AI_DISCLAIMER }, 'Meal plan.'); }
export async function create(req, res) { return createdResponse(res, { plan: await mealService.createMealPlan(req.user._id, req.body), disclaimer: AI_DISCLAIMER }, 'Meal plan saved.'); }
export async function update(req, res) { return successResponse(res, { plan: await mealService.updateMealPlan(req.user._id, req.params.id, req.body), disclaimer: AI_DISCLAIMER }, 'Meal plan updated.'); }
export async function remove(req, res) { await mealService.deleteMealPlan(req.user._id, req.params.id); return successResponse(res, null, 'Meal plan deleted.'); }
