import { User, UserRepository } from './UserRepository';
export declare class SqlUserRepository implements UserRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(id: number): Promise<User | null>;
    create(email: string, passwordHash: string): Promise<User>;
}
//# sourceMappingURL=SqlUserRepository.d.ts.map