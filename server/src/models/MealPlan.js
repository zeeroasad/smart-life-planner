import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  quantity: { type: Number, default: 1, min: 0 },
  unit: { type: String, default: 'item', trim: true, maxlength: 30 },
  estimatedCost: { type: Number, default: 0, min: 0 }
}, { _id: false });

const mealSchema = new mongoose.Schema({
  mealType: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true, maxlength: 120 },
  calories: { type: Number, default: 0, min: 0 },
  protein: { type: Number, default: 0, min: 0 },
  carbs: { type: Number, default: 0, min: 0 },
  fat: { type: Number, default: 0, min: 0 },
  ingredients: { type: [ingredientSchema], default: [] }
}, { _id: true });

const mealPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  goal: { type: String, required: true },
  calorieTarget: { type: Number, required: true, min: 500, max: 10000 },
  dietaryPreference: { type: String, required: true },
  allergies: { type: [String], default: [] },
  meals: { type: [mealSchema], default: [] },
  totals: {
    calories: { type: Number, default: 0 }, protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 }, fat: { type: Number, default: 0 }
  },
  source: { type: String, enum: ['manual', 'ai', 'fallback'], default: 'manual' }
}, { timestamps: true });

export const MealPlan = mongoose.model('MealPlan', mealPlanSchema);
