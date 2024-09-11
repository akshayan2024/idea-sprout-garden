import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const authService = {
  loginWithGoogle: async (credentialResponse) => {
    try {
      const response = await axios.post(`${API_URL}/auth/google`, { credential: credentialResponse.credential });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`);
    } catch (error) {
      throw error;
    }
  },

  checkSession: async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/session`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};