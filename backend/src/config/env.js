"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config({ path: '../.env' }); // Load from root
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().default('3000'),
    JWT_SECRET: zod_1.z.string(),
    STORAGE_MODE: zod_1.z.enum(['in-memory', 'sql']).default('in-memory'),
    DATABASE_DIALECT: zod_1.z.enum(['postgres', 'mysql']).default('postgres'),
    DATABASE_URL: zod_1.z.string().optional(),
    FRONTEND_URL: zod_1.z.string().default('http://localhost:5173'),
});
const _env = envSchema.safeParse(process.env);
if (!_env.success) {
    console.error('❌ Invalid environment variables', _env.error.format());
    process.exit(1);
}
exports.env = _env.data;
//# sourceMappingURL=env.js.map