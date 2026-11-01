import mongoose from 'mongoose';

const aiCacheSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  feature: { type: String, required: true },
  inputHash: { type: String, required: true },
  result: { type: mongoose.Schema.Types.Mixed, required: true },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

aiCacheSchema.index({ userId: 1, feature: 1, inputHash: 1 }, { unique: true });
aiCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const AiCache = mongoose.model('AiCache', aiCacheSchema);
