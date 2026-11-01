import { User } from '../models/User.js';
import { Budget } from '../models/Budget.js';
import { Expense } from '../models/Expense.js';
import { GroceryList } from '../models/GroceryList.js';
import { MealPlan } from '../models/MealPlan.js';
import { toCsv } from '../utils/csv.js';

export async function exportUserData(userId, format = 'json') {
  const [user, budgets, expenses, groceryLists, mealPlans] = await Promise.all([
    User.findById(userId).lean(), Budget.find({ userId }).lean(), Expense.find({ userId }).lean(), GroceryList.find({ userId }).lean(), MealPlan.find({ userId }).lean()
  ]);
  const data = { profile: { name: user.name, email: user.email, role: user.role, status: user.status, currency: user.currency, health: user.health }, budgets, expenses, groceryLists, mealPlans };
  if (format !== 'csv') return { type: 'json', data };
  const rows = [
    ...budgets.map((item) => ({ type: 'budget', month: item.month, category: item.category, amount: item.amount, note: '' })),
    ...expenses.map((item) => ({ type: 'expense', month: item.month, category: item.category, amount: item.amount, note: item.note })),
    ...groceryLists.flatMap((list) => list.items.map((item) => ({ type: 'grocery', month: list.month, category: 'Groceries', amount: item.estimatedCost * item.quantity, note: `${list.name}: ${item.name}` })))
  ];
  return { type: 'csv', data: toCsv(rows, [{ key: 'type', label: 'type' }, { key: 'month', label: 'month' }, { key: 'category', label: 'category' }, { key: 'amount', label: 'amount' }, { key: 'note', label: 'note' }]) };
}
