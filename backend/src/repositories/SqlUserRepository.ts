import { User, UserRepository } from './UserRepository';
import { User as UserModel } from '../storage/models/User';

export class SqlUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      password_hash: user.password_hash,
    };
  }

  async findById(id: number): Promise<User | null> {
    const user = await UserModel.findByPk(id);
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      password_hash: user.password_hash,
    };
  }

  async create(email: string, passwordHash: string): Promise<User> {
    const user = await UserModel.create({
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
