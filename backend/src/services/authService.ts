import bcrypt from 'bcrypt';
import { getUserRepository } from '../repositories';
import { generateToken } from '../utils/jwt';

const userRepo = getUserRepository();

export const login = async (email: string, password: string) => {
  const user = await userRepo.findByEmail(email);
  
  if (!user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  
  if (!isPasswordValid) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } };
  }

  const token = generateToken(user.id, user.email);

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

export const register = async (email: string, password: string) => {
  const existingUser = await userRepo.findByEmail(email);
  if (existingUser) {
    return { success: false, error: { code: 'CONFLICT', message: 'Email already exists' } };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userRepo.create(email, passwordHash);

  const token = generateToken(user.id, user.email);

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

export const getMe = async (userId: number) => {
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
