import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Feedback API
export const feedbackAPI = {
  // Submit feedback
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
  getFeedback: async (params = {}) => {
    try {
      const response = await api.get('/feedback', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch feedback');
    }
  },

  // Get statistics
  getStats: async (sessionId) => {
    try {
      const response = await api.get('/feedback/stats', {
        params: sessionId ? { sessionId } : {},
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch statistics');
    }
  },

  // Get AI summary
  getSummary: async (sessionId, limit = 20) => {
    try {
      const response = await api.get('/feedback/summary', {
        params: { sessionId, limit },
      });
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

