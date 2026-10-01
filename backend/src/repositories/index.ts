import { env } from '../config/env';
import { UserRepository } from './UserRepository';
import { DayStatusRepository } from './DayStatusRepository';
import { InMemoryUserRepository } from './InMemoryUserRepository';
import { InMemoryDayStatusRepository } from './InMemoryDayStatusRepository';
import { SqlUserRepository } from './SqlUserRepository';
import { SqlDayStatusRepository } from './SqlDayStatusRepository';

// Singleton instances
const inMemoryUserRepo = new InMemoryUserRepository();
const inMemoryDayStatusRepo = new InMemoryDayStatusRepository();

const sqlUserRepo = new SqlUserRepository();
const sqlDayStatusRepo = new SqlDayStatusRepository();

export const getUserRepository = (): UserRepository => {
  return env.STORAGE_MODE === 'sql' ? sqlUserRepo : inMemoryUserRepo;
};

export const getDayStatusRepository = (): DayStatusRepository => {
  return env.STORAGE_MODE === 'sql' ? sqlDayStatusRepo : inMemoryDayStatusRepo;
};
