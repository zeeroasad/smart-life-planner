import { Budget } from '../models/Budget.js';
import { Expense } from '../models/Expense.js';
import { GroceryList } from '../models/GroceryList.js';
import { ServiceError } from '../utils/serviceError.js';

const groceryTotal = (lists) => lists.reduce((sum, list) => sum + list.items.reduce((itemSum, item) => itemSum + (item.estimatedCost || 0) * (item.quantity || 1), 0), 0);

export async function getSummary(userId, month) {
  const [budgets, expenses, lists] = await Promise.all([
    Budget.find({ userId, month }).sort({ category: 1 }).lean(),
    Expense.find({ userId, month }).sort({ createdAt: -1 }).lean(),
    GroceryList.find({ userId, month }).lean()
  ]);
  const manualSpending = expenses.reduce((map, expense) => { map[expense.category] = (map[expense.category] || 0) + expense.amount; return map; }, {});
  const grocerySpent = groceryTotal(lists);
  const rows = budgets.map((budget) => ({ ...budget, id: budget._id.toString(), budgeted: budget.amount, spent: (manualSpending[budget.category] || 0) + (budget.category === 'Groceries' ? grocerySpent : 0), remaining: budget.amount - ((manualSpending[budget.category] || 0) + (budget.category === 'Groceries' ? grocerySpent : 0)) }));
  return { month, budgets: rows, expenses, grocerySpent, totalBudgeted: rows.reduce((sum, row) => sum + row.budgeted, 0), totalSpent: rows.reduce((sum, row) => sum + row.spent, 0) };
}

export async function upsertBudget(userId, input) {
  const budget = await Budget.findOneAndUpdate({ userId, month: input.month, category: input.category }, { amount: input.amount }, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true });
  return budget;
}

export async function deleteBudget(userId, id) {
  const deleted = await Budget.findOneAndDelete({ _id: id, userId });
  if (!deleted) throw new ServiceError(404, 'BUDGET_NOT_FOUND', 'Budget not found.');
}

export async function addExpense(userId, input) {
  return Expense.create({ userId, ...input });
}

export async function deleteExpense(userId, id) {
  const deleted = await Expense.findOneAndDelete({ _id: id, userId });
  if (!deleted) throw new ServiceError(404, 'EXPENSE_NOT_FOUND', 'Expense not found.');
}
