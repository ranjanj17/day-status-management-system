"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryUserRepository = void 0;
const UserRepository_1 = require("./UserRepository");
class InMemoryUserRepository {
    users = [];
    currentId = 1;
    async findByEmail(email) {
        return this.users.find(u => u.email === email) || null;
    }
    async findById(id) {
        return this.users.find(u => u.id === id) || null;
    }
    async create(email, passwordHash) {
        const user = {
            id: this.currentId++,
            email,
            password_hash: passwordHash,
        };
        this.users.push(user);
        return user;
    }
}
exports.InMemoryUserRepository = InMemoryUserRepository;
//# sourceMappingURL=InMemoryUserRepository.js.map