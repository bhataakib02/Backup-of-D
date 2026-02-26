import React, { useState, useEffect } from 'react';

const RealTimeThreats = () => {
  const [threats, setThreats] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [stats, setStats] = useState({
    totalThreats: 0,
    activeThreats: 0,
    blockedThreats: 0
  });

  const generateThreat = () => {
    const threatTypes = ['Malware', 'Phishing', 'DDoS', 'Intrusion', 'Ransomware'];
    const countries = ['USA', 'China', 'Russia', 'Germany', 'Brazil', 'India'];
    const severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    
    return {
      id: Date.now() + Math.random(),
      type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
      source: countries[Math.floor(Math.random() * countries.length)],
      target: countries[Math.floor(Math.random() * countries.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      timestamp: new Date().toLocaleTimeString(),
      ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
    };
  };

  useEffect(() => {
    let interval;
    if (isMonitoring) {
      interval = setInterval(() => {
        const newThreat = generateThreat();
        setThreats(prev => [newThreat, ...prev.slice(0, 9)]);
        setStats(prev => ({
          totalThreats: prev.totalThreats + 1,
          activeThreats: prev.activeThreats + (Math.random() > 0.7 ? 1 : 0),
          blockedThreats: prev.blockedThreats + (Math.random() > 0.5 ? 1 : 0)
        }));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isMonitoring]);

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-red-600 mb-2">
          Real-Time Threat Intelligence
        </h1>
        <p className="text-lg text-gray-600">
          Live Global Threat Monitoring & Analysis
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Total Threats</h3>
          <p className="text-2xl font-bold text-red-600">{stats.totalThreats}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Active Threats</h3>
          <p className="text-2xl font-bold text-orange-600">{stats.activeThreats}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Blocked Threats</h3>
          <p className="text-2xl font-bold text-green-600">{stats.blockedThreats}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Live Threat Feed</h2>
          <button
            onClick={toggleMonitoring}
            className={`px-4 py-2 rounded-lg font-medium ${
              isMonitoring 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </button>
        </div>
        
        {isMonitoring && (
          <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg">
            <p className="text-green-800 font-medium">🟢 Live monitoring active - Threats updating every 2 seconds</p>
          </div>
        )}

        <div className="space-y-3">
          {threats.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Click "Start Monitoring" to begin real-time threat detection
            </p>
          ) : (
            threats.map((threat) => (
              <div key={threat.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded font-medium ${
                        threat.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                        threat.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                        threat.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {threat.severity}
                      </span>
                      <span className="font-medium">{threat.type}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {threat.source} → {threat.target} | IP: {threat.ip}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{threat.timestamp}</p>
                    <button className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-1">
                      Analyze
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Threat Map Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'Global Threat Visualization', 'Real-Time Attack Tracking', 'Geolocation Analysis',
            'Threat Source Mapping', 'Attack Vector Analysis', 'Live Feed Integration'
          ].map((feature, index) => (
            <div key={index} className="p-3 border rounded-lg">
              <h4 className="font-medium">{feature}</h4>
              <p className="text-sm text-gray-600">Real-time feature {index + 1}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RealTimeThreats;
