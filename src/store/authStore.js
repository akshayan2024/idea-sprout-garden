import { create } from 'zustand';
import { authService } from '../services/authService';

export const useAuthStore = create((set) => ({
  isLoggedIn: true, // Always set to true for now
  userProfile: { id: 'dummy-user-id', email: 'dummy@example.com', name: 'Dummy User' },
  login: async (email, password) => {
    // TODO: Implement with third-party authentication service
    const userData = await authService.login(email, password);
    set({ userProfile: userData });
  },
  logout: async () => {
    // TODO: Implement with third-party authentication service
    await authService.logout();
  },
  checkSession: async () => {
    // TODO: Implement with third-party authentication service
    const { isAuthenticated, profile } = await authService.checkSession();
    set({ userProfile: profile });
  }
}));