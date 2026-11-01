import { User } from '../models/User.js';
import { ServiceError } from '../utils/serviceError.js';

export async function listAccounts() {
  return User.find({}, 'name email role status createdAt updatedAt').sort({ createdAt: -1 }).lean();
}

export async function setAccountStatus(id, status) {
  const existing = await User.findById(id).select('role');
  if (!existing) throw new ServiceError(404, 'USER_NOT_FOUND', 'Account not found.');
  if (existing.role === 'admin' && status === 'disabled') throw new ServiceError(400, 'ADMIN_PROTECTED', 'Admin accounts cannot be disabled here.');
  const user = await User.findByIdAndUpdate(id, { status }, { new: true }).select('name email role status createdAt updatedAt');
  if (!user) throw new ServiceError(404, 'USER_NOT_FOUND', 'Account not found.');
  return user;
}
