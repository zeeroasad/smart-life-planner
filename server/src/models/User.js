import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 160 },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  status: { type: String, enum: ['active', 'disabled'], default: 'active' },
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
  currency: { type: String, default: 'PKR' },
  health: {
    goal: { type: String, default: 'maintain' },
    calorieTarget: { type: Number, default: 2000 },
    allergies: { type: [String], default: [] },
    dietaryPreference: { type: String, default: 'balanced' }
  }
}, { timestamps: true });

userSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id.toString(), name: this.name, email: this.email, role: this.role,
    status: this.status, currency: this.currency, health: this.health,
    createdAt: this.createdAt, updatedAt: this.updatedAt
  };
};

export const User = mongoose.model('User', userSchema);
