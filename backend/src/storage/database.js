"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const env_1 = require("../config/env");
let sequelizeInstance;
if (env_1.env.STORAGE_MODE === 'sql') {
    if (!env_1.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is required when STORAGE_MODE is sql');
    }
    sequelizeInstance = new sequelize_1.Sequelize(env_1.env.DATABASE_URL, {
        dialect: env_1.env.DATABASE_DIALECT,
        logging: false, // Set to console.log to see SQL queries
    });
}
else {
    // Mock instance for in-memory mode so imports don't fail
    sequelizeInstance = new sequelize_1.Sequelize('sqlite::memory:', { logging: false });
}
exports.sequelize = sequelizeInstance;
const connectDB = async () => {
    if (env_1.env.STORAGE_MODE !== 'sql')
        return;
    try {
        await exports.sequelize.authenticate();
        console.log(`✅ Connected to ${env_1.env.DATABASE_DIALECT} database`);
    }
    catch (error) {
        console.error('❌ Database connection error:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=database.js.map