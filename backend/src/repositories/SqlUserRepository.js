"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlUserRepository = void 0;
const UserRepository_1 = require("./UserRepository");
const User_1 = require("../storage/models/User");
class SqlUserRepository {
    async findByEmail(email) {
        const user = await User_1.User.findOne({ where: { email } });
        if (!user)
            return null;
        return {
            id: user.id,
            email: user.email,
            password_hash: user.password_hash,
        };
    }
    async findById(id) {
        const user = await User_1.User.findByPk(id);
        if (!user)
            return null;
        return {
            id: user.id,
            email: user.email,
            password_hash: user.password_hash,
        };
    }
    async create(email, passwordHash) {
        const user = await User_1.User.create({
            email,
            password_hash: passwordHash,
        });
        return {
            id: user.id,
            email: user.email,
            password_hash: user.password_hash,
        };
    }
}
exports.SqlUserRepository = SqlUserRepository;
//# sourceMappingURL=SqlUserRepository.js.map