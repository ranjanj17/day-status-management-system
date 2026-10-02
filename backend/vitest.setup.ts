import { beforeAll } from 'vitest';
import { env } from './src/config/env';
import { connectDB, sequelize } from './src/storage/database';
import { initUserModel } from './src/storage/models/User';
import { initDayStatusModel, associateModels } from './src/storage/models/DayStatus';

beforeAll(async () => {
  if (env.STORAGE_MODE === 'sql') {
    initUserModel();
    initDayStatusModel();
    associateModels();
    await connectDB();
    await sequelize.sync({ force: true });
  }
});
