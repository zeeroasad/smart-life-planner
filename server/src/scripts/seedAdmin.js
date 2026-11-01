import bcrypt from 'bcryptjs';
import { connectDatabase } from '../db/connect.js';
import { config } from '../config/env.js';
import { User } from '../models/User.js';

await connectDatabase();
const passwordHash = await bcrypt.hash(config.adminPassword, 12);
await User.findOneAndUpdate(
  { email: config.adminEmail.toLowerCase() },
  { name: 'Planner Admin', email: config.adminEmail.toLowerCase(), passwordHash, role: 'admin', status: 'active', currency: config.defaultCurrency },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);
console.log(`Admin seeded for ${config.adminEmail}.`);
process.exit(0);
