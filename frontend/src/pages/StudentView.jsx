import { useState } from 'react';
import { feedbackService } from '../services/api';

const FEEDBACK_TYPES = [
  { value: 'confused', label: '😕 Confused', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'too-fast', label: '⚡ Too Fast', color: 'bg-red-100 text-red-800' },
  { value: 'too-slow', label: '🐌 Too Slow', color: 'bg-blue-100 text-blue-800' },
  { value: 'great', label: '👍 Great!', color: 'bg-green-100 text-green-800' },
  { value: 'question', label: '❓ Question', color: 'bg-purple-100 text-purple-800' },
  { value: 'other', label: '💬 Other', color: 'bg-gray-100 text-gray-800' },
];

function StudentView() {
  const [message, setMessage] = useState('');
  const [type, setType] = useState('confused');
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
      await feedbackService.submitFeedback(message, type);
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
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Submit Anonymous Feedback
        </h2>
        <p className="text-gray-600 mb-6">
          Your feedback helps improve the class experience. All submissions are anonymous.
        </p>

        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            ✅ Feedback submitted successfully! Thank you for your input.
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {FEEDBACK_TYPES.map((feedbackType) => (
                <button
                  key={feedbackType.value}
                  type="button"
                  onClick={() => setType(feedbackType.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    type === feedbackType.value
                      ? `${feedbackType.color} border-primary-500`
                      : 'bg-white border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <div className="text-sm font-medium">{feedbackType.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Your Feedback (Optional)
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Share your thoughts, questions, or concerns..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Your feedback will be analyzed by AI to help the professor understand class engagement and sentiment.
          </p>
        </div>
      </div>
    </div>
  );
}

export default StudentView;
