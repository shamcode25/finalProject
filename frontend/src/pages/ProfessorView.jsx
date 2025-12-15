import { useState, useEffect } from 'react';
import { feedbackAPI } from '../services/api';
import { getSocket } from '../services/socket';
import LoadingSpinner from '../components/LoadingSpinner';

const FEEDBACK_TYPE_LABELS = {
  'confused': '😕 Confused',
  'too-fast': '⚡ Too Fast',
  'too-slow': '🐌 Too Slow',
  'great': '👍 Great!',
  'question': '❓ Question',
  'other': '💬 Other',
};

const SENTIMENT_COLORS = {
  positive: 'bg-green-100 text-green-800 border-green-300',
  negative: 'bg-red-100 text-red-800 border-red-300',
  neutral: 'bg-gray-100 text-gray-800 border-gray-300',
};

export default function ProfessorView() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: 'all', sentiment: 'all' });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
    initSocketConnection();

    return () => {
      const socket = getSocket();
      socket.off('new-feedback');
      socket.off('feedback-deleted');
    };
  }, []);

  useEffect(() => {
    if (stats) {
      loadSummary();
    }
  }, [stats]);

  const initSocketConnection = () => {
    const socket = getSocket();
    
    socket.on('new-feedback', (newFeedback) => {
      setFeedbacks((prev) => [newFeedback, ...prev]);
      loadStats();
    });

    socket.on('feedback-deleted', ({ id }) => {
      setFeedbacks((prev) => prev.filter((f) => f._id !== id));
      loadStats();
    });
  };

  const loadData = async () => {
    try {
      await Promise.all([loadFeedbacks(), loadStats()]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadFeedbacks = async () => {
    try {
      const response = await feedbackAPI.getFeedback({ limit: 50 });
      setFeedbacks(response.feedbacks || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadStats = async () => {
    try {
      const response = await feedbackAPI.getStats();
      setStats(response.stats);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadSummary = async () => {
    try {
      const response = await feedbackAPI.getSummary();
      setSummary(response.summary);
    } catch (err) {
      console.error('Failed to load summary:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await feedbackAPI.deleteFeedback(id);
        setFeedbacks((prev) => prev.filter((f) => f._id !== id));
        loadStats();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const filteredFeedbacks = feedbacks.filter((f) => {
    if (filter.type !== 'all' && f.type !== filter.type) return false;
    if (filter.sentiment !== 'all' && f.sentiment !== filter.sentiment) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Professor Dashboard
          </h1>
          <p className="text-gray-600">Real-time student feedback and analytics</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Total Feedback</div>
              <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Last Hour</div>
              <div className="text-3xl font-bold text-indigo-600">{stats.recent}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Avg Confidence</div>
              <div className="text-3xl font-bold text-green-600">
                {(stats.avgConfidence * 100).toFixed(0)}%
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">AI Analysis</div>
              <div className="text-lg font-semibold text-purple-600">Active</div>
            </div>
          </div>
        )}

        {/* AI Summary */}
        {summary && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-lg p-6 mb-8 border border-purple-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🤖</span> AI-Generated Summary
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Summary</h3>
                <p className="text-gray-700">{summary.summary}</p>
              </div>
              {summary.keyPoints && summary.keyPoints.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Key Points</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {summary.keyPoints.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
              {summary.recommendations && summary.recommendations.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Recommendations</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {summary.recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Type
              </label>
              <select
                value={filter.type}
                onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Types</option>
                {Object.entries(FEEDBACK_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Sentiment
              </label>
              <select
                value={filter.sentiment}
                onChange={(e) => setFilter({ ...filter, sentiment: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Sentiments</option>
                <option value="positive">Positive</option>
                <option value="negative">Negative</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Live Feedback ({filteredFeedbacks.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {filteredFeedbacks.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No feedback available
              </div>
            ) : (
              filteredFeedbacks.map((feedback) => (
                <div
                  key={feedback._id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                          {FEEDBACK_TYPE_LABELS[feedback.type] || feedback.type}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${
                            SENTIMENT_COLORS[feedback.sentiment] || SENTIMENT_COLORS.neutral
                          }`}
                        >
                          {feedback.sentiment || 'neutral'}
                        </span>
                        {feedback.confidence > 0 && (
                          <span className="text-xs text-gray-500">
                            Confidence: {(feedback.confidence * 100).toFixed(0)}%
                          </span>
                        )}
                      </div>
                      <p className="text-gray-800 mb-2">{feedback.message}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(feedback.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(feedback._id)}
                      className="ml-4 text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

