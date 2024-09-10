import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const contentService = {
  processContentAspiration: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/process-input`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  generateIdeas: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/generate-ideas`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};