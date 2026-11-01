import app from './app.js';
import { config } from './config/env.js';
import { connectDatabase } from './db/connect.js';

await connectDatabase();
app.listen(config.port, '0.0.0.0', () => console.log(`Smart Life Planner API listening on port ${config.port}`));
