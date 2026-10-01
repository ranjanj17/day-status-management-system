export interface User {
  id: number;
  email: string;
  password_hash: string;
}

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  create(email: string, passwordHash: string): Promise<User>;
}
