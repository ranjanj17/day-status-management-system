import { Sequelize } from 'sequelize';
import { env } from '../config/env';

let sequelizeInstance: Sequelize;

if (env.STORAGE_MODE === 'sql') {
  if (env.DATABASE_DIALECT === 'sqlite') {
    sequelizeInstance = new Sequelize({
      dialect: 'sqlite',
      storage: process.env.NODE_ENV === 'test' ? ':memory:' : './database.sqlite', // Use memory for tests to avoid wiping local db
      logging: false,
    });
  } else {
    if (!env.DATABASE_URL) {
      throw new Error('DATABASE_URL is required when STORAGE_MODE is sql (unless using sqlite)');
    }

    sequelizeInstance = new Sequelize(env.DATABASE_URL, {
      dialect: env.DATABASE_DIALECT as 'postgres' | 'mysql',
      logging: false, // Set to console.log to see SQL queries
    });
  }
} else {
  // Mock instance for in-memory mode so imports don't fail
  sequelizeInstance = new Sequelize('sqlite::memory:', { logging: false });
}

export const sequelize = sequelizeInstance;

export const connectDB = async () => {
  if (env.STORAGE_MODE !== 'sql') return;
  try {
    await sequelize.authenticate();
    console.log(`✅ Connected to ${env.DATABASE_DIALECT} database`);
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};
