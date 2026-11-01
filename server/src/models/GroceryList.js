import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  quantity: { type: Number, default: 1, min: 0 },
  unit: { type: String, default: 'item', trim: true, maxlength: 30 },
  estimatedCost: { type: Number, default: 0, min: 0 },
  checked: { type: Boolean, default: false }
}, { _id: true });

const groceryListSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  month: { type: String, required: true, match: /^\d{4}-\d{2}$/ },
  items: { type: [itemSchema], default: [] },
  sourceMealPlanId: { type: mongoose.Schema.Types.ObjectId, ref: 'MealPlan', default: null }
}, { timestamps: true });

export const GroceryList = mongoose.model('GroceryList', groceryListSchema);
