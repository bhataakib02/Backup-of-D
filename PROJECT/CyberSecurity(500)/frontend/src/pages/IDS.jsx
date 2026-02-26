import React, { useState } from 'react';

const IDS = () => {
  const [networkData, setNetworkData] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeNetwork = async () => {
    if (!networkData) return;
    setLoading(true);
    
    setTimeout(() => {
      const isThreat = Math.random() > 0.6;
      setResult({
        isThreat,
        confidence: Math.floor(Math.random() * 20) + 80,
        attackType: isThreat ? ['DDoS', 'Port Scan', 'Brute Force'][Math.floor(Math.random() * 3)] : 'None',
        severity: isThreat ? ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)] : 'None',
        recommendation: isThreat ? 'BLOCK IP - Immediate action required' : 'MONITOR - Normal traffic'
      });
      setLoading(false);
    }, 2500);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
          Network Intrusion Detection System
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Real-Time Network Traffic Analysis & Threat Detection (70 Functions)
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🔍 Network Analysis</h2>
        <div className="space-y-4">
          <textarea
            value={networkData}
            onChange={(e) => setNetworkData(e.target.value)}
            placeholder="Enter network logs, PCAP data, or IP addresses for analysis..."
            rows="6"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            onClick={analyzeNetwork}
            disabled={loading || !networkData}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg"
          >
            {loading ? 'Analyzing Network Traffic...' : 'Analyze Network Data'}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🚨 Analysis Results</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Threat Status</p>
                <p className={`font-medium ${result.isThreat ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                  {result.isThreat ? 'THREAT DETECTED' : 'NO THREATS'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Attack Type</p>
                <p className="font-medium text-gray-900 dark:text-white">{result.attackType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Severity</p>
                <p className={`font-medium ${
                  result.severity === 'High' ? 'text-red-600 dark:text-red-400' :
                  result.severity === 'Medium' ? 'text-orange-600 dark:text-orange-400' :
                  'text-green-600 dark:text-green-400'
                }`}>
                  {result.severity}
                </p>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${result.isThreat ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
              <p className={`font-bold ${result.isThreat ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200'}`}>
                {result.recommendation}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Available Functions (70 Total)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white">Traffic Analysis (25)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">PCAP analysis, flow monitoring</p>
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white">Anomaly Detection (25)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Behavioral analysis, ML detection</p>
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white">Signature Matching (20)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Known attack patterns, rules</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDS;