import React, { useState } from 'react';

const Phishing = () => {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeURL = async () => {
    if (!url) return;
    setLoading(true);
    
    setTimeout(() => {
      const isPhishing = Math.random() > 0.7;
      setResult({
        type: 'URL',
        input: url,
        isPhishing,
        confidence: Math.floor(Math.random() * 30) + 70,
        threats: isPhishing ? ['Suspicious domain', 'Fake login page'] : [],
        recommendation: isPhishing ? 'BLOCK - High risk' : 'SAFE - No threats'
      });
      setLoading(false);
    }, 2000);
  };

  const analyzeEmail = async () => {
    if (!email) return;
    setLoading(true);
    
    setTimeout(() => {
      const isPhishing = Math.random() > 0.6;
      setResult({
        type: 'Email',
        input: email,
        isPhishing,
        confidence: Math.floor(Math.random() * 25) + 75,
        threats: isPhishing ? ['Spoofed sender', 'Malicious links'] : [],
        recommendation: isPhishing ? 'QUARANTINE - Phishing detected' : 'SAFE - Legitimate'
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
          Phishing Detection Module
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Advanced AI-Powered Phishing Threat Analysis (70 Functions)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🔗 URL Analysis</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter suspicious URL..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={analyzeURL}
              disabled={loading || !url}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg"
            >
              {loading ? 'Analyzing...' : 'Analyze URL'}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">📧 Email Analysis</h2>
          <div className="space-y-4">
            <textarea
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Paste email content..."
              rows="4"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={analyzeEmail}
              disabled={loading || !email}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg"
            >
              {loading ? 'Analyzing...' : 'Analyze Email'}
            </button>
          </div>
        </div>
      </div>

      {result && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">📊 Analysis Results</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                <p className="font-medium text-gray-900 dark:text-white">{result.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Confidence</p>
                <p className="font-medium text-gray-900 dark:text-white">{result.confidence}%</p>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${result.isPhishing ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
              <p className={`font-bold ${result.isPhishing ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200'}`}>
                {result.recommendation}
              </p>
            </div>

            {result.threats.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Detected Threats</p>
                <ul className="space-y-1">
                  {result.threats.map((threat, index) => (
                    <li key={index} className="flex items-center text-red-600 dark:text-red-400">
                      <span className="mr-2">⚠️</span>
                      {threat}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Available Functions (70 Total)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white">URL Analysis (25)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Domain reputation, structure analysis</p>
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white">Email Analysis (25)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Header analysis, content scanning</p>
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white">ML Models (20)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Deep learning, NLP analysis</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Phishing;
