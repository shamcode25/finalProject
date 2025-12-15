function SummaryCard({ summary, loading, onLoad }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">🤖 AI Summary</h3>
        <button
          onClick={onLoad}
          disabled={loading}
          className="px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 disabled:bg-gray-400 transition"
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-sm text-gray-600">Analyzing feedback...</p>
        </div>
      )}

      {!loading && !summary && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm mb-4">
            Click "Generate" to get an AI-powered summary of student feedback
          </p>
        </div>
      )}

      {!loading && summary && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Summary</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{summary.summary}</p>
          </div>

          {summary.keyInsights && summary.keyInsights.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Insights</h4>
              <ul className="list-disc list-inside space-y-1">
                {summary.keyInsights.map((insight, index) => (
                  <li key={index} className="text-sm text-gray-600">{insight}</li>
                ))}
              </ul>
            </div>
          )}

          {summary.recommendations && summary.recommendations.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Recommendations</h4>
              <ul className="list-disc list-inside space-y-1">
                {summary.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-primary-600">{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SummaryCard;

