import React, { useState } from 'react';

const ThreatHunting = () => {
  const [query, setQuery] = useState('find high severity events with C2 communication last 24h');
  const [timeRange, setTimeRange] = useState('24h');
  const [limit, setLimit] = useState(25);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [parsed, setParsed] = useState(null);
  const [error, setError] = useState('');

  const runHunt = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/hunt/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, timeRange, limit })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Hunt failed');
      setResults(data.results || []);
      setParsed(data.parsed || null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">AI Threat Hunting</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">Natural-language hunting across indicators, events and techniques</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <input
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., show high severity C2 events by IP in last 1h"
            />
          </div>
          <select
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="1h">Last 1h</option>
            <option value="24h">Last 24h</option>
            <option value="7d">Last 7d</option>
          </select>
          <input
            type="number"
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value || '0', 10))}
            min={1}
            max={200}
          />
          <button
            onClick={runHunt}
            disabled={loading}
            className={`px-6 py-3 rounded-lg text-white font-semibold ${loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Hunting…' : 'Run Hunt'}
          </button>
        </div>
        {error && (
          <div className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</div>
        )}
      </div>

      {parsed && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Parsed Intent</h3>
          <div className="text-sm text-gray-700 dark:text-gray-300">Entities: {parsed.entities.join(', ')}</div>
          <div className="text-sm text-gray-700 dark:text-gray-300">Techniques: {parsed.techniques.join(', ')}</div>
          <div className="text-sm text-gray-700 dark:text-gray-300">Confidence: {parsed.confidence}%</div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Results ({results.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((r) => (
            <div key={r.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-gray-900 dark:text-white">{r.indicator.toUpperCase()}</div>
                <span className={`px-2 py-1 rounded-full text-xs ${r.severity === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : r.severity === 'Medium' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>{r.severity}</span>
              </div>
              <div className="mt-1 font-mono text-sm text-gray-800 dark:text-gray-200 break-words">{r.value}</div>
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">Technique: {r.technique} • {new Date(r.timestamp).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThreatHunting;






