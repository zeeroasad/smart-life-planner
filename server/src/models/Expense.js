import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  month: { type: String, required: true, match: /^\d{4}-\d{2}$/ },
  category: { type: String, required: true, trim: true, maxlength: 40 },
  amount: { type: Number, required: true, min: 0 },
  note: { type: String, default: '', trim: true, maxlength: 160 }
}, { timestamps: true });

expenseSchema.index({ userId: 1, month: 1 });
export const Expense = mongoose.model('Expense', expenseSchema);
