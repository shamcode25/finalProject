import { useState } from 'react';
import { feedbackAPI } from '../services/api';

const FEEDBACK_TYPES = [
  { value: 'confused', label: '😕 Confused', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'too-fast', label: '⚡ Too Fast', color: 'bg-red-100 text-red-800' },
  { value: 'too-slow', label: '🐌 Too Slow', color: 'bg-blue-100 text-blue-800' },
  { value: 'great', label: '👍 Great!', color: 'bg-green-100 text-green-800' },
  { value: 'question', label: '❓ Question', color: 'bg-purple-100 text-purple-800' },
  { value: 'other', label: '💬 Other', color: 'bg-gray-100 text-gray-800' },
];

export default function StudentView() {
  const [message, setMessage] = useState('');
  const [selectedType, setSelectedType] = useState('other');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await feedbackAPI.submitFeedback(message, selectedType);
      setSuccess(true);
      setMessage('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Student Feedback
            </h1>
            <p className="text-gray-600">
              Share your thoughts anonymously with your professor
            </p>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">
                ✓ Feedback submitted successfully!
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Feedback Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {FEEDBACK_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setSelectedType(type.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedType === type.value
                        ? `${type.color} border-current font-semibold`
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Your Feedback
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="Share your thoughts, questions, or concerns..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Your feedback is anonymous and will be analyzed by AI for insights.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

