import { create } from 'zustand';
import { authService } from '../services/authService';

export const useAuthStore = create((set) => ({
  isLoggedIn: false,
  userProfile: null,
  login: async (email, password) => {
    try {
      const userData = await authService.login(email, password);
      set({ isLoggedIn: true, userProfile: userData });
    } catch (error) {
      console.error('Login failed:', error);
    }
  },
  logout: async () => {
    try {
      await authService.logout();
      set({ isLoggedIn: false, userProfile: null });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  },
  checkSession: async () => {
    try {
      const { isAuthenticated, profile } = await authService.checkSession();
      set({ isLoggedIn: isAuthenticated, userProfile: profile });
    } catch (error) {
      console.error('Session check failed:', error);
    }
  }
}));