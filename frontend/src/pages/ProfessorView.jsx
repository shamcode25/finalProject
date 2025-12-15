import { useState, useEffect, useRef } from 'react';
import { feedbackService } from '../services/api';
import { createSocket } from '../services/socket';
import FeedbackCard from '../components/FeedbackCard';
import StatsCard from '../components/StatsCard';
import SummaryCard from '../components/SummaryCard';

const FEEDBACK_TYPES = {
  confused: { label: '😕 Confused', color: 'bg-yellow-100 text-yellow-800' },
  'too-fast': { label: '⚡ Too Fast', color: 'bg-red-100 text-red-800' },
  'too-slow': { label: '🐌 Too Slow', color: 'bg-blue-100 text-blue-800' },
  great: { label: '👍 Great!', color: 'bg-green-100 text-green-800' },
  question: { label: '❓ Question', color: 'bg-purple-100 text-purple-800' },
  other: { label: '💬 Other', color: 'bg-gray-100 text-gray-800' },
};

const SENTIMENT_COLORS = {
  positive: 'text-green-600',
  negative: 'text-red-600',
  neutral: 'text-gray-600',
};

function ProfessorView() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterSentiment, setFilterSentiment] = useState('all');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    loadData();
    const cleanup = setupSocket();

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [feedbacksData, statsData] = await Promise.all([
        feedbackService.getAllFeedback(),
        feedbackService.getStats(),
      ]);
      setFeedbacks(feedbacksData);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    try {
      setSummaryLoading(true);
      const summaryData = await feedbackService.getSummary();
      setSummary(summaryData);
    } catch (err) {
      console.error('Failed to load summary:', err);
    } finally {
      setSummaryLoading(false);
    }
  };

  const setupSocket = () => {
    const socket = createSocket();
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('new-feedback', (newFeedback) => {
      setFeedbacks((prev) => [newFeedback, ...prev]);
      loadData(); // Reload stats
    });

    socket.on('feedback-deleted', (id) => {
      setFeedbacks((prev) => prev.filter((f) => f._id !== id));
      loadData(); // Reload stats
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  };

  const handleDelete = async (id) => {
    try {
      await feedbackService.deleteFeedback(id);
      setFeedbacks((prev) => prev.filter((f) => f._id !== id));
      loadData(); // Reload stats
    } catch (err) {
      alert('Failed to delete feedback');
    }
  };

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    if (filterType !== 'all' && feedback.type !== filterType) return false;
    if (filterSentiment !== 'all' && feedback.sentiment !== filterSentiment) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Professor Dashboard</h2>
        <p className="text-gray-600">Real-time student feedback and analytics</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          ❌ {error}
        </div>
      )}

      {/* Stats and Summary Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <StatsCard stats={stats} />
        </div>
        <div>
          <SummaryCard
            summary={summary}
            loading={summaryLoading}
            onLoad={loadSummary}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Types</option>
              {Object.entries(FEEDBACK_TYPES).map(([value, { label }]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Sentiment
            </label>
            <select
              value={filterSentiment}
              onChange={(e) => setFilterSentiment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>
          <div className="ml-auto">
            <button
              onClick={loadData}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Live Feedback ({filteredFeedbacks.length})
        </h3>
        {filteredFeedbacks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">No feedback yet. Waiting for student submissions...</p>
          </div>
        ) : (
          filteredFeedbacks.map((feedback) => (
            <FeedbackCard
              key={feedback._id}
              feedback={feedback}
              onDelete={handleDelete}
              typeInfo={FEEDBACK_TYPES[feedback.type]}
              sentimentColor={SENTIMENT_COLORS[feedback.sentiment]}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ProfessorView;
