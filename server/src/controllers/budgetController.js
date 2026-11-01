import * as budgetService from '../services/budgetService.js';
import { successResponse, createdResponse } from '../utils/apiResponse.js';

const currentMonth = () => new Date().toISOString().slice(0, 7);
export async function summary(req, res) { return successResponse(res, await budgetService.getSummary(req.user._id, req.query.month || currentMonth()), 'Budget summary.'); }
export async function upsert(req, res) { return createdResponse(res, await budgetService.upsertBudget(req.user._id, req.body), 'Budget saved.'); }
export async function remove(req, res) { await budgetService.deleteBudget(req.user._id, req.params.id); return successResponse(res, null, 'Budget deleted.'); }
export async function addExpense(req, res) { return createdResponse(res, await budgetService.addExpense(req.user._id, req.body), 'Expense added.'); }
export async function removeExpense(req, res) { await budgetService.deleteExpense(req.user._id, req.params.id); return successResponse(res, null, 'Expense deleted.'); }
