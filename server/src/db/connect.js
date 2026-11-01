import mongoose from 'mongoose';
import { config } from '../config/env.js';

export async function connectDatabase() {
  // FR-02: one MongoDB database is shared while every service applies user scope.
  await mongoose.connect(config.mongoUri);
  console.log('MongoDB connected');
}
