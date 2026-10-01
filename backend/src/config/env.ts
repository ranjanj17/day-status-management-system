import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ path: '../.env' }); // Load from root

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  JWT_SECRET: z.string(),
  STORAGE_MODE: z.enum(['in-memory', 'sql']).default('in-memory'),
  DATABASE_DIALECT: z.enum(['postgres', 'mysql']).default('postgres'),
  DATABASE_URL: z.string().optional(),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
