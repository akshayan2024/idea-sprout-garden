import { create } from 'zustand';
import { authService } from '../services/authService';
import { logger } from '../utils/logger';

export const useAuthStore = create((set) => ({
  isLoggedIn: false,
  userProfile: null,
  login: async (credentialResponse) => {
    try {
      logger.info('Attempting login with Google');
      const userData = await authService.loginWithGoogle(credentialResponse);
      set({ userProfile: userData, isLoggedIn: true });
      logger.info('Login successful', { userId: userData.id });
    } catch (error) {
      logger.error('Login failed', { error: error.message });
      throw error;
    }
  },
  logout: async () => {
    try {
      logger.info('Attempting logout');
      await authService.logout();
      set({ userProfile: null, isLoggedIn: false });
      logger.info('Logout successful');
    } catch (error) {
      logger.error('Logout failed', { error: error.message });
      throw error;
    }
  },
  checkSession: async () => {
    try {
      logger.info('Checking session');
      const { isAuthenticated, profile } = await authService.checkSession();
      set({ userProfile: profile, isLoggedIn: isAuthenticated });
      logger.info('Session check complete', { isAuthenticated, userId: profile?.id });
    } catch (error) {
      logger.error('Session check failed', { error: error.message });
      throw error;
    }
  }
}));