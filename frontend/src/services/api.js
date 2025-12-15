import axios from 'axios';

// Use Vite proxy (relative URL) or environment variable, fallback to correct port
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const feedbackService = {
  // Submit new feedback
  submitFeedback: async (message, type, sessionId = 'default-session') => {
    try {
      const response = await api.post('/feedback', {
        message,
        type,
        sessionId,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to submit feedback');
    }
  },

  // Get all feedback
  getAllFeedback: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.sessionId) params.append('sessionId', filters.sessionId);
      if (filters.type) params.append('type', filters.type);
      if (filters.sentiment) params.append('sentiment', filters.sentiment);

      const response = await api.get(`/feedback?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch feedback');
    }
  },

  // Get statistics
  getStats: async (sessionId = null) => {
    try {
      const params = sessionId ? `?sessionId=${sessionId}` : '';
      const response = await api.get(`/feedback/stats${params}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch statistics');
    }
  },

  // Get AI summary
  getSummary: async (sessionId = null) => {
    try {
      const params = sessionId ? `?sessionId=${sessionId}` : '';
      const response = await api.get(`/feedback/summary${params}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch summary');
    }
  },

  // Delete feedback
  deleteFeedback: async (id) => {
    try {
      const response = await api.delete(`/feedback/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete feedback');
    }
  },
};

export default api;
