"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const database_1 = require("./storage/database");
const User_1 = require("./storage/models/User");
const DayStatus_1 = require("./storage/models/DayStatus");
const bcrypt_1 = __importDefault(require("bcrypt"));
const initializeDatabase = async () => {
    if (env_1.env.STORAGE_MODE === 'sql') {
        (0, User_1.initUserModel)();
        (0, DayStatus_1.initDayStatusModel)();
        (0, DayStatus_1.associateModels)();
        await (0, database_1.connectDB)();
        // Sync models
        await database_1.sequelize.sync({ alter: true });
        // Seed test user
        const { User } = require('./storage/models/User');
        const existingAdmin = await User.findOne({ where: { email: 'admin@example.com' } });
        if (!existingAdmin) {
            const hash = await bcrypt_1.default.hash('password123', 10);
            await User.create({ email: 'admin@example.com', password_hash: hash });
            console.log('✅ Seeded admin user: admin@example.com / password123');
        }
    }
    else {
        // Seed for in-memory
        const { getUserRepository } = require('./repositories');
        const userRepo = getUserRepository();
        const hash = await bcrypt_1.default.hash('password123', 10);
        await userRepo.create('admin@example.com', hash);
        console.log('✅ Seeded admin user (in-memory): admin@example.com / password123');
    }
};
const startServer = async () => {
    try {
        await initializeDatabase();
        app_1.default.listen(env_1.env.PORT, () => {
            console.log(`🚀 Server running in ${env_1.env.NODE_ENV} mode on port ${env_1.env.PORT}`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map