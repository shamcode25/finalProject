function StatsCard({ stats }) {
  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">Loading statistics...</p>
      </div>
    );
  }

  const sentimentData = [
    { label: 'Positive', value: stats.bySentiment?.positive || 0, color: 'bg-green-500' },
    { label: 'Negative', value: stats.bySentiment?.negative || 0, color: 'bg-red-500' },
    { label: 'Neutral', value: stats.bySentiment?.neutral || 0, color: 'bg-gray-500' },
  ];

  const typeData = [
    { label: 'Great', value: stats.byType?.great || 0, color: 'bg-green-500' },
    { label: 'Confused', value: stats.byType?.confused || 0, color: 'bg-yellow-500' },
    { label: 'Too Fast', value: stats.byType?.['too-fast'] || 0, color: 'bg-red-500' },
    { label: 'Too Slow', value: stats.byType?.['too-slow'] || 0, color: 'bg-blue-500' },
    { label: 'Question', value: stats.byType?.question || 0, color: 'bg-purple-500' },
    { label: 'Other', value: stats.byType?.other || 0, color: 'bg-gray-500' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Statistics</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-primary-50 rounded-lg p-4">
          <div className="text-3xl font-bold text-primary-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Feedback</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-3xl font-bold text-green-600">{stats.recentCount}</div>
          <div className="text-sm text-gray-600">Last Hour</div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">By Sentiment</h4>
        <div className="space-y-2">
          {sentimentData.map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{item.label}</span>
                <span className="font-medium">{item.value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${item.color} h-2 rounded-full transition-all`}
                  style={{
                    width: stats.total > 0 ? `${(item.value / stats.total) * 100}%` : '0%',
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">By Type</h4>
        <div className="grid grid-cols-2 gap-2">
          {typeData.map((item) => (
            <div key={item.label} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm text-gray-600">{item.label}</span>
              <span className="font-semibold">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StatsCard;

