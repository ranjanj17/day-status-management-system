import { Sequelize } from 'sequelize';
import { env } from '../config/env';

let sequelizeInstance: Sequelize;

if (env.STORAGE_MODE === 'sql') {
  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required when STORAGE_MODE is sql');
  }

  sequelizeInstance = new Sequelize(env.DATABASE_URL, {
    dialect: env.DATABASE_DIALECT as 'postgres' | 'mysql',
    logging: false, // Set to console.log to see SQL queries
  });
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
