"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDayStatusRepository = exports.getUserRepository = void 0;
const env_1 = require("../config/env");
const UserRepository_1 = require("./UserRepository");
const DayStatusRepository_1 = require("./DayStatusRepository");
const InMemoryUserRepository_1 = require("./InMemoryUserRepository");
const InMemoryDayStatusRepository_1 = require("./InMemoryDayStatusRepository");
const SqlUserRepository_1 = require("./SqlUserRepository");
const SqlDayStatusRepository_1 = require("./SqlDayStatusRepository");
// Singleton instances
const inMemoryUserRepo = new InMemoryUserRepository_1.InMemoryUserRepository();
const inMemoryDayStatusRepo = new InMemoryDayStatusRepository_1.InMemoryDayStatusRepository();
const sqlUserRepo = new SqlUserRepository_1.SqlUserRepository();
const sqlDayStatusRepo = new SqlDayStatusRepository_1.SqlDayStatusRepository();
const getUserRepository = () => {
    return env_1.env.STORAGE_MODE === 'sql' ? sqlUserRepo : inMemoryUserRepo;
};
exports.getUserRepository = getUserRepository;
const getDayStatusRepository = () => {
    return env_1.env.STORAGE_MODE === 'sql' ? sqlDayStatusRepo : inMemoryDayStatusRepo;
};
exports.getDayStatusRepository = getDayStatusRepository;
//# sourceMappingURL=index.js.map