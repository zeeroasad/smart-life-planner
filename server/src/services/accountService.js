import { User } from '../models/User.js';
import { Budget } from '../models/Budget.js';
import { Expense } from '../models/Expense.js';
import { GroceryList } from '../models/GroceryList.js';
import { MealPlan } from '../models/MealPlan.js';
import { AiCache } from '../models/AiCache.js';
import { RefreshToken } from '../models/RefreshToken.js';
import { PasswordResetToken } from '../models/PasswordResetToken.js';
import { ServiceError } from '../utils/serviceError.js';

export async function updateProfile(userId, input) {
  const user = await User.findByIdAndUpdate(userId, { name: input.name, currency: input.currency, health: input.health }, { new: true, runValidators: true });
  return user.toSafeObject();
}

export async function deleteAccount(userId) {
  const user = await User.findById(userId);
  if (!user) throw new ServiceError(404, 'USER_NOT_FOUND', 'Account not found.');
  await Promise.all([Budget.deleteMany({ userId }), Expense.deleteMany({ userId }), GroceryList.deleteMany({ userId }), MealPlan.deleteMany({ userId }), AiCache.deleteMany({ userId }), RefreshToken.deleteMany({ userId }), PasswordResetToken.deleteMany({ userId }), User.deleteOne({ _id: userId })]);
}
