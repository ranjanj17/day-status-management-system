import app from './app';
import { env } from './config/env';
import { connectDB, sequelize } from './storage/database';
import { initUserModel } from './storage/models/User';
import { initDayStatusModel, associateModels } from './storage/models/DayStatus';
import bcrypt from 'bcrypt';

const initializeDatabase = async () => {
  if (env.STORAGE_MODE === 'sql') {
    initUserModel();
    initDayStatusModel();
    associateModels();
    
    await connectDB();
    
    // Sync models
    await sequelize.sync({ alter: true });
    
    // Seed test user
    const { User } = require('./storage/models/User');
    const existingAdmin = await User.findOne({ where: { email: 'admin@example.com' } });
    if (!existingAdmin) {
      const hash = await bcrypt.hash('password123', 10);
      await User.create({ email: 'admin@example.com', password_hash: hash });
      console.log('✅ Seeded admin user: admin@example.com / password123');
    }
  } else {
    // Seed for in-memory
    const { getUserRepository } = require('./repositories');
    const userRepo = getUserRepository();
    const hash = await bcrypt.hash('password123', 10);
    await userRepo.create('admin@example.com', hash);
    console.log('✅ Seeded admin user (in-memory): admin@example.com / password123');
  }
};

const startServer = async () => {
  try {
    await initializeDatabase();
    
    app.listen(env.PORT, () => {
      console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
