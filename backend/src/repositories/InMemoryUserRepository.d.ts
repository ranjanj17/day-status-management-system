import { User, UserRepository } from './UserRepository';
export declare class InMemoryUserRepository implements UserRepository {
    private users;
    private currentId;
    findByEmail(email: string): Promise<User | null>;
    findById(id: number): Promise<User | null>;
    create(email: string, passwordHash: string): Promise<User>;
}
//# sourceMappingURL=InMemoryUserRepository.d.ts.map