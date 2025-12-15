function FeedbackCard({ feedback, onDelete, typeInfo, sentimentColor }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeInfo.color}`}>
              {typeInfo.label}
            </span>
            <span className={`text-sm font-medium ${sentimentColor}`}>
              {feedback.sentiment === 'positive' && '😊'}
              {feedback.sentiment === 'negative' && '😟'}
              {feedback.sentiment === 'neutral' && '😐'} {feedback.sentiment}
            </span>
            {feedback.confidence > 0 && (
              <span className="text-xs text-gray-500">
                Confidence: {Math.round(feedback.confidence * 100)}%
              </span>
            )}
          </div>
          {feedback.message && (
            <p className="text-gray-700 mb-2">{feedback.message}</p>
          )}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>🕐 {formatTime(feedback.timestamp)}</span>
            {feedback.aiClassification && feedback.aiClassification !== feedback.type && (
              <span className="text-primary-600">
                AI: {feedback.aiClassification}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => onDelete(feedback._id)}
          className="ml-4 text-red-500 hover:text-red-700 transition"
          title="Delete feedback"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default FeedbackCard;

