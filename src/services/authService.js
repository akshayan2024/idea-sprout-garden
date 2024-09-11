import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password }, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },

  register: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/register`, { email, password }, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      throw error;
    }
  },

  logout: async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout error:', error.response?.data || error.message);
      throw error;
    }
  },

  checkSession: async () => {
    try {
      const response = await axios.get(`${API_URL}/check-session`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Session check error:', error.response?.data || error.message);
      throw error;
    }
  }
};