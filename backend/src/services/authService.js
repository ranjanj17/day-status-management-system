"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.register = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const repositories_1 = require("../repositories");
const jwt_1 = require("../utils/jwt");
const userRepo = (0, repositories_1.getUserRepository)();
const login = async (email, password) => {
    const user = await userRepo.findByEmail(email);
    if (!user) {
        return { success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } };
    }
    const isPasswordValid = await bcrypt_1.default.compare(password, user.password_hash);
    if (!isPasswordValid) {
        return { success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } };
    }
    const token = (0, jwt_1.generateToken)(user.id, user.email);
    return {
        success: true,
        data: {
            token,
            user: {
                id: user.id,
                email: user.email,
            },
        },
    };
};
exports.login = login;
const register = async (email, password) => {
    const existingUser = await userRepo.findByEmail(email);
    if (existingUser) {
        return { success: false, error: { code: 'CONFLICT', message: 'Email already exists' } };
    }
    const passwordHash = await bcrypt_1.default.hash(password, 10);
    const user = await userRepo.create(email, passwordHash);
    const token = (0, jwt_1.generateToken)(user.id, user.email);
    return {
        success: true,
        data: {
            token,
            user: {
                id: user.id,
                email: user.email,
            },
        },
    };
};
exports.register = register;
const getMe = async (userId) => {
    const user = await userRepo.findById(userId);
    if (!user) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'User not found' } };
    }
    return {
        success: true,
        data: {
            user: {
                id: user.id,
                email: user.email,
            },
        },
    };
};
exports.getMe = getMe;
//# sourceMappingURL=authService.js.map