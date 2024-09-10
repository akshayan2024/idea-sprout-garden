import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await axios.post(`${API_URL}/logout`);
    } catch (error) {
      throw error;
    }
  },

  checkSession: async () => {
    try {
      const response = await axios.get(`${API_URL}/check-session`, { withCredentials: true });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};