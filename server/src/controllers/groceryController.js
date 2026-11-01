import * as groceryService from '../services/groceryService.js';
import { successResponse, createdResponse } from '../utils/apiResponse.js';

export async function list(req, res) { return successResponse(res, await groceryService.listGroceryLists(req.user._id, req.query.month), 'Grocery lists.'); }
export async function getOne(req, res) { return successResponse(res, await groceryService.getGroceryList(req.user._id, req.params.id), 'Grocery list.'); }
export async function create(req, res) { return createdResponse(res, await groceryService.createGroceryList(req.user._id, req.body), 'Grocery list created.'); }
export async function update(req, res) { return successResponse(res, await groceryService.updateGroceryList(req.user._id, req.params.id, req.body), 'Grocery list updated.'); }
export async function remove(req, res) { await groceryService.deleteGroceryList(req.user._id, req.params.id); return successResponse(res, null, 'Grocery list deleted.'); }
export async function fromMeal(req, res) { return createdResponse(res, await groceryService.createFromMealPlan(req.user._id, req.body.mealPlanId, req.body.name, req.body.month), 'Grocery list generated from meal plan.'); }
