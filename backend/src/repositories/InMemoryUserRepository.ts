import { User, UserRepository } from './UserRepository';

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];
  private currentId = 1;

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email === email) || null;
  }

  async findById(id: number): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }

  async create(email: string, passwordHash: string): Promise<User> {
    const user: User = {
      id: this.currentId++,
      email,
      password_hash: passwordHash,
    };
    this.users.push(user);
    return user;
  }
}
