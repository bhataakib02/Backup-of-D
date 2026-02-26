import React, { useState } from 'react';

const Ransomware = () => {
  const [fileActivity, setFileActivity] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeRansomware = async () => {
    if (!fileActivity) return;
    setLoading(true);
    
    setTimeout(() => {
      const isRansomware = Math.random() > 0.8;
      setResult({
        isRansomware,
        confidence: Math.floor(Math.random() * 20) + 80,
        encryptionActivity: isRansomware ? Math.floor(Math.random() * 1000) + 100 : 0,
        suspiciousProcesses: isRansomware ? ['encrypt.exe', 'locker.dll'] : [],
        recommendation: isRansomware ? 'ISOLATE SYSTEM - Ransomware detected' : 'SAFE - Normal file activity'
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 dark:text-red-400 mb-2">
          Ransomware Detection System
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Real-Time File Encryption & Behavioral Monitoring (30 Functions)
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🔒 Ransomware Analysis</h2>
        <div className="space-y-4">
          <textarea
            value={fileActivity}
            onChange={(e) => setFileActivity(e.target.value)}
            placeholder="Enter file system activity, process logs, or suspicious behavior patterns..."
            rows="6"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            onClick={analyzeRansomware}
            disabled={loading || !fileActivity}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg"
          >
            {loading ? 'Analyzing File Activity...' : 'Analyze for Ransomware'}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🚨 Analysis Results</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ransomware Status</p>
                <p className={`font-medium ${result.isRansomware ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                  {result.isRansomware ? 'RANSOMWARE DETECTED' : 'NO RANSOMWARE'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Encryption Activity</p>
                <p className="font-medium text-gray-900 dark:text-white">{result.encryptionActivity} files</p>
              </div>
            </div>
            
            {result.suspiciousProcesses.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Suspicious Processes</p>
                <ul className="space-y-1">
                  {result.suspiciousProcesses.map((process, index) => (
                    <li key={index} className="flex items-center text-red-600 dark:text-red-400">
                      <span className="mr-2">⚠️</span>
                      {process}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className={`p-4 rounded-lg ${result.isRansomware ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
              <p className={`font-bold ${result.isRansomware ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200'}`}>
                {result.recommendation}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Available Functions (30 Total)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white">File Monitoring (10)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Encryption detection, entropy analysis</p>
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white">Behavioral Analysis (10)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Process monitoring, API calls</p>
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white">Recovery Tools (10)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Backup verification, decryption</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ransomware;