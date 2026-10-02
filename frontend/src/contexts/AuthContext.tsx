import { create } from 'zustand';
import { api } from '../services/api';

interface User {
  id: number;
  email: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  login: (token, user) => {
    localStorage.setItem('token', token);
    set({ user });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null });
  },
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await api.get('/auth/me');
        set({ user: res.data.data.user, loading: false });
        return;
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    set({ loading: false });
  }
}));

// Initialize auth state immediately when the module loads
useAuth.getState().checkAuth();
