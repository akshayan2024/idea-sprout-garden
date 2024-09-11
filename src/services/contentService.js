import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const contentService = {
  uploadContentAspiration: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/upload-aspiration`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  processContentAspiration: async (userId) => {
    try {
      const response = await axios.post(`${API_URL}/process-aspiration`, { user_id: userId });
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
  },

  fetchExistingIdeas: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/user-ideas/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};