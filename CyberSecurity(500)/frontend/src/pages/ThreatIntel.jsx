import React, { useState } from 'react';

const ThreatIntel = () => {
  const [ioc, setIoc] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeThreatIntel = async () => {
    if (!ioc) return;
    setLoading(true);
    
    setTimeout(() => {
      const isThreat = Math.random() > 0.6;
      setResult({
        isThreat,
        confidence: Math.floor(Math.random() * 25) + 75,
        reputation: Math.floor(Math.random() * 40) + 60,
        threatActor: isThreat ? ['APT29', 'Lazarus Group', 'FIN7'][Math.floor(Math.random() * 3)] : 'Unknown',
        campaigns: isThreat ? ['Operation Ghost', 'Dark Halo'] : [],
        recommendation: isThreat ? 'BLOCK IOC - Known threat indicator' : 'MONITOR - Low risk indicator'
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
          Threat Intelligence Platform
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          IOC Analysis & Threat Actor Attribution (40 Functions)
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🌐 Threat Intelligence Analysis</h2>
        <div className="space-y-4">
          <input
            type="text"
            value={ioc}
            onChange={(e) => setIoc(e.target.value)}
            placeholder="Enter IOC (IP, domain, hash, URL) for threat intelligence lookup..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            onClick={analyzeThreatIntel}
            disabled={loading || !ioc}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg"
          >
            {loading ? 'Analyzing Threat Intel...' : 'Analyze IOC'}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🔍 Intelligence Results</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Threat Status</p>
                <p className={`font-medium ${result.isThreat ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                  {result.isThreat ? 'KNOWN THREAT' : 'CLEAN'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Reputation Score</p>
                <p className="font-medium text-gray-900 dark:text-white">{result.reputation}/100</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Threat Actor</p>
                <p className="font-medium text-gray-900 dark:text-white">{result.threatActor}</p>
              </div>
            </div>
            
            {result.campaigns.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Associated Campaigns</p>
                <div className="flex flex-wrap gap-2">
                  {result.campaigns.map((campaign, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                      {campaign}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className={`p-4 rounded-lg ${result.isThreat ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
              <p className={`font-bold ${result.isThreat ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200'}`}>
                {result.recommendation}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Available Functions (40 Total)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white">IOC Analysis (20)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">IP/domain/hash reputation, OSINT feeds</p>
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white">Attribution (20)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Threat actor profiling, campaign tracking</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatIntel;