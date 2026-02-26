import React, { useState, useEffect } from 'react';

const RealTimeThreats = () => {
  const [threats, setThreats] = useState([]);
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [isMonitoring, setIsMonitoring] = useState(true);

  useEffect(() => {
    if (!isMonitoring) return;

    const generateThreat = () => ({
      id: Date.now() + Math.random(),
      type: ['Malware', 'Phishing', 'DDoS', 'Intrusion', 'Ransomware'][Math.floor(Math.random() * 5)],
      severity: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
      country: ['United States', 'China', 'Russia', 'Brazil', 'Germany', 'France', 'Japan', 'India'][Math.floor(Math.random() * 8)],
      ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      timestamp: new Date().toLocaleTimeString(),
      description: 'Suspicious activity detected',
      lat: Math.random() * 180 - 90,
      lng: Math.random() * 360 - 180
    });

    const interval = setInterval(() => {
      setThreats(prev => {
        const newThreats = [generateThreat(), ...prev.slice(0, 19)]; // Keep last 20
        return newThreats;
      });
    }, 3000);

    // Initial threats
    setThreats(Array.from({length: 10}, generateThreat));

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      case 'Medium': return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20';
      case 'Low': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">
          Real-Time Threat Intelligence
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Global Threat Monitoring & Live Attack Visualization
        </p>
        <div className="mt-4 flex items-center justify-center space-x-4">
          <div className={`flex items-center px-4 py-2 rounded-full ${isMonitoring ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className={`text-sm font-medium ${isMonitoring ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
              {isMonitoring ? 'Live Monitoring Active' : 'Monitoring Paused'}
            </span>
          </div>
          <button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isMonitoring 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isMonitoring ? 'Pause Monitoring' : 'Resume Monitoring'}
          </button>
        </div>
      </div>

      {/* Threat Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Threats</h3>
          <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{threats.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">High Severity</h3>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">
            {threats.filter(t => t.severity === 'High').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Countries</h3>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {new Set(threats.map(t => t.country)).size}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Last Update</h3>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {threats[0]?.timestamp || 'N/A'}
          </p>
        </div>
      </div>

      {/* Global Threat Map Placeholder */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🌍 Global Threat Map</h2>
        <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg p-8 text-center text-white">
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className="text-xl font-bold mb-2">Interactive Global Threat Map</h3>
          <p className="text-blue-200">Real-time visualization of global cyber threats</p>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-red-500/20 rounded p-2">
              <div className="text-red-300">🔴 High Risk</div>
              <div className="font-bold">{threats.filter(t => t.severity === 'High').length}</div>
            </div>
            <div className="bg-orange-500/20 rounded p-2">
              <div className="text-orange-300">🟡 Medium Risk</div>
              <div className="font-bold">{threats.filter(t => t.severity === 'Medium').length}</div>
            </div>
            <div className="bg-green-500/20 rounded p-2">
              <div className="text-green-300">🟢 Low Risk</div>
              <div className="font-bold">{threats.filter(t => t.severity === 'Low').length}</div>
            </div>
            <div className="bg-blue-500/20 rounded p-2">
              <div className="text-blue-300">📊 Total</div>
              <div className="font-bold">{threats.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Threat Feed */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">📡 Live Threat Feed</h2>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {threats.map((threat) => (
            <div
              key={threat.id}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedThreat(threat)}
            >
              <div className="flex items-center space-x-4">
                <div className="text-2xl">
                  {threat.type === 'Malware' && '🦠'}
                  {threat.type === 'Phishing' && '🎣'}
                  {threat.type === 'DDoS' && '⚡'}
                  {threat.type === 'Intrusion' && '🔍'}
                  {threat.type === 'Ransomware' && '🔒'}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{threat.type} Attack</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {threat.country} • {threat.ip} • {threat.timestamp}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(threat.severity)}`}>
                  {threat.severity}
                </span>
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200">
                  Analyze
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Threat Detail Modal */}
      {selectedThreat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Threat Details</h3>
              <button
                onClick={() => setSelectedThreat(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedThreat.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Severity</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(selectedThreat.severity)}`}>
                  {selectedThreat.severity}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Source</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedThreat.country}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">IP Address</p>
                <p className="font-mono text-gray-900 dark:text-white">{selectedThreat.ip}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Time</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedThreat.timestamp}</p>
              </div>
            </div>
            <div className="mt-6 flex space-x-3">
              <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg">
                Block IP
              </button>
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
                Investigate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimeThreats;