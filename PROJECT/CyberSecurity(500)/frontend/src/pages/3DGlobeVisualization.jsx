import React, { useState, useEffect } from 'react';
import { createProfessionalText, createSecondaryText, createMutedText, createAccentText } from '../utils/rainbowText';

const Globe3DVisualization = () => {
  const [attacks, setAttacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAttack, setSelectedAttack] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [globeRotation, setGlobeRotation] = useState(0);

  const globeFunctions = [
    // 3D Globe Visualization (25 Functions)
    { id: 1, name: 'Attack Flow Visualization', category: 'flows', description: 'Visualize attack flows on 3D globe', status: 'active' },
    { id: 2, name: 'Threat Heatmap Overlay', category: 'heatmaps', description: 'Overlay threat heatmaps on globe', status: 'active' },
    { id: 3, name: 'Real-time Attack Animation', category: 'animation', description: 'Animate real-time attacks', status: 'active' },
    { id: 4, name: 'Geographic Threat Clustering', category: 'clustering', description: 'Cluster threats by geography', status: 'active' },
    { id: 5, name: 'Attack Timeline Playback', category: 'timeline', description: 'Playback attack timeline', status: 'active' },
    { id: 6, name: 'Interactive Globe Controls', category: 'controls', description: 'Interactive globe navigation', status: 'active' },
    { id: 7, name: 'Multi-layer Visualization', category: 'layers', description: 'Multiple visualization layers', status: 'active' },
    { id: 8, name: 'Attack Path Tracing', category: 'paths', description: 'Trace attack paths', status: 'active' },
    { id: 9, name: 'Threat Actor Movement', category: 'movement', description: 'Track threat actor movement', status: 'active' },
    { id: 10, name: 'Infrastructure Mapping', category: 'infrastructure', description: 'Map threat infrastructure', status: 'active' },
    { id: 11, name: 'C2 Server Visualization', category: 'c2', description: 'Visualize C2 servers', status: 'active' },
    { id: 12, name: 'Botnet Network Mapping', category: 'botnet', description: 'Map botnet networks', status: 'active' },
    { id: 13, name: 'DDoS Attack Visualization', category: 'ddos', description: 'Visualize DDoS attacks', status: 'active' },
    { id: 14, name: 'Ransomware Campaign Tracking', category: 'ransomware', description: 'Track ransomware campaigns', status: 'active' },
    { id: 15, name: 'Phishing Campaign Mapping', category: 'phishing', description: 'Map phishing campaigns', status: 'active' },
    { id: 16, name: 'Malware Distribution Tracking', category: 'malware', description: 'Track malware distribution', status: 'active' },
    { id: 17, name: 'Data Exfiltration Flows', category: 'exfiltration', description: 'Visualize data exfiltration', status: 'active' },
    { id: 18, name: 'Insider Threat Mapping', category: 'insider', description: 'Map insider threats', status: 'active' },
    { id: 19, name: 'Supply Chain Attack Visualization', category: 'supply', description: 'Visualize supply chain attacks', status: 'active' },
    { id: 20, name: 'APT Campaign Tracking', category: 'apt', description: 'Track APT campaigns', status: 'active' },
    { id: 21, name: 'Cryptocurrency Flow Tracking', category: 'crypto', description: 'Track cryptocurrency flows', status: 'active' },
    { id: 22, name: 'Dark Web Activity Mapping', category: 'darkweb', description: 'Map dark web activity', status: 'active' },
    { id: 23, name: 'Social Media Threat Tracking', category: 'social', description: 'Track social media threats', status: 'active' },
    { id: 24, name: 'IoT Device Mapping', category: 'iot', description: 'Map IoT devices and attacks', status: 'active' },
    { id: 25, name: 'Cloud Security Visualization', category: 'cloud', description: 'Visualize cloud security events', status: 'active' }
  ];

  const categoryTitles = {
    flows: 'Attack Flow Visualization',
    heatmaps: 'Threat Heatmaps',
    animation: 'Real-time Animation',
    clustering: 'Geographic Clustering',
    timeline: 'Timeline Playback',
    controls: 'Interactive Controls',
    layers: 'Multi-layer Visualization',
    paths: 'Attack Path Tracing',
    movement: 'Threat Movement',
    infrastructure: 'Infrastructure Mapping',
    c2: 'C2 Server Visualization',
    botnet: 'Botnet Networks',
    ddos: 'DDoS Attacks',
    ransomware: 'Ransomware Campaigns',
    phishing: 'Phishing Campaigns',
    malware: 'Malware Distribution',
    exfiltration: 'Data Exfiltration',
    insider: 'Insider Threats',
    supply: 'Supply Chain Attacks',
    apt: 'APT Campaigns',
    crypto: 'Cryptocurrency Flows',
    darkweb: 'Dark Web Activity',
    social: 'Social Media Threats',
    iot: 'IoT Security',
    cloud: 'Cloud Security'
  };

  useEffect(() => {
    // Simulate loading attacks
    const timer = setTimeout(() => {
      setIsLoading(false);
      setAttacks([
        {
          id: 1,
          type: 'DDoS Attack',
          source: { lat: 40.7128, lng: -74.0060, country: 'USA' },
          target: { lat: 51.5074, lng: -0.1278, country: 'UK' },
          severity: 'High',
          timestamp: new Date().toISOString(),
          description: 'Large-scale DDoS attack targeting UK infrastructure'
        },
        {
          id: 2,
          type: 'Ransomware Campaign',
          source: { lat: 55.7558, lng: 37.6176, country: 'Russia' },
          target: { lat: 35.6762, lng: 139.6503, country: 'Japan' },
          severity: 'Critical',
          timestamp: new Date().toISOString(),
          description: 'Ransomware campaign targeting Japanese healthcare'
        },
        {
          id: 3,
          type: 'Phishing Campaign',
          source: { lat: 39.9042, lng: 116.4074, country: 'China' },
          target: { lat: -33.8688, lng: 151.2093, country: 'Australia' },
          severity: 'Medium',
          timestamp: new Date().toISOString(),
          description: 'Phishing campaign targeting Australian businesses'
        }
      ]);
    }, 2000);

    // Globe rotation animation
    const rotationInterval = setInterval(() => {
      setGlobeRotation(prev => (prev + 1) % 360);
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(rotationInterval);
    };
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'text-red-500';
      case 'High': return 'text-orange-500';
      case 'Medium': return 'text-yellow-500';
      case 'Low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const handleAnalyzeAttack = (attack) => {
    setSelectedAttack(attack);
    setShowAnalysis(true);
  };

  const closeAnalysis = () => {
    setShowAnalysis(false);
    setSelectedAttack(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="cyber-text-muted mt-4">Loading 3D globe visualization...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sticky top-0 bg-gray-50 dark:bg-gray-900 py-4 z-10">
          <h1 className="text-4xl font-bold cyber-text-primary mb-2">
            3D Globe Visualization
          </h1>
          <p className="cyber-text-secondary">
            Interactive 3D globe with real-time attack flows and threat visualization
          </p>
        </div>

        {/* Master Input */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter attack type, country, or threat indicator for 3D visualization..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-200">
              Execute 3D Analysis
            </button>
          </div>
        </div>

        {/* 3D Globe Visualization */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold cyber-text-primary mb-4 text-center">
            Interactive 3D Globe
          </h2>
          <div className="relative h-96 bg-gradient-to-br from-blue-900 via-blue-800 to-green-900 rounded-lg overflow-hidden">
            {/* 3D Globe */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="w-80 h-80 rounded-full bg-gradient-to-br from-blue-400 via-blue-600 to-green-500 shadow-2xl"
                style={{ 
                  transform: `rotateY(${globeRotation}deg) rotateX(20deg)`,
                  transition: 'transform 0.1s ease-out'
                }}
              >
                {/* Globe Surface */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-green-300 via-blue-400 to-blue-600 opacity-80">
                  {/* Continents */}
                  <div className="absolute top-1/4 left-1/4 w-8 h-6 bg-green-600 rounded-full opacity-70"></div>
                  <div className="absolute top-1/3 right-1/4 w-6 h-8 bg-green-600 rounded-full opacity-70"></div>
                  <div className="absolute bottom-1/3 left-1/3 w-10 h-4 bg-green-600 rounded-full opacity-70"></div>
                  <div className="absolute bottom-1/4 right-1/3 w-7 h-5 bg-green-600 rounded-full opacity-70"></div>
                </div>
                
                {/* 3D Effect Rings */}
                <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
                <div className="absolute inset-2 rounded-full border-2 border-white/10"></div>
                <div className="absolute inset-6 rounded-full border border-white/5"></div>
              </div>
            </div>
            
            {/* Attack Flows */}
            {attacks.map((attack, index) => (
              <div key={attack.id} className="absolute inset-0">
                {/* Source Point */}
                <div 
                  className="absolute w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg"
                  style={{
                    left: `${50 + (attack.source.lng / 180) * 40}%`,
                    top: `${50 - (attack.source.lat / 90) * 40}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                </div>
                
                {/* Target Point */}
                <div 
                  className="absolute w-4 h-4 bg-orange-500 rounded-full animate-pulse shadow-lg"
                  style={{
                    left: `${50 + (attack.target.lng / 180) * 40}%`,
                    top: `${50 - (attack.target.lat / 90) * 40}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-75"></div>
                </div>
                
                {/* Attack Flow Line */}
                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                  <defs>
                    <linearGradient id={`gradient-${attack.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>
                  <line
                    x1={`${50 + (attack.source.lng / 180) * 40}%`}
                    y1={`${50 - (attack.source.lat / 90) * 40}%`}
                    x2={`${50 + (attack.target.lng / 180) * 40}%`}
                    y2={`${50 - (attack.target.lat / 90) * 40}%`}
                    stroke={`url(#gradient-${attack.id})`}
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className="animate-pulse"
                  />
                </svg>
              </div>
            ))}
            
            {/* Orbital Rings */}
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }}></div>
            <div className="absolute inset-4 rounded-full border border-yellow-400/20 animate-spin" style={{ animationDuration: '25s' }}></div>
            <div className="absolute inset-8 rounded-full border border-green-400/15 animate-spin" style={{ animationDuration: '35s', animationDirection: 'reverse' }}></div>
          </div>
        </div>

        {/* Function Categories */}
        {Object.entries(categoryTitles).map(([category, title]) => {
          const categoryFunctions = globeFunctions.filter(func => func.category === category);
          
          return (
            <div key={category} className="mb-8">
              <h2 className="text-2xl font-bold cyber-text-primary mb-4 text-center">
                {title} ({categoryFunctions.length} Functions)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryFunctions.map((func) => (
                  <div
                    key={func.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-200 cursor-pointer"
                    onClick={() => handleAnalyzeAttack(func)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold cyber-text-primary text-sm">
                        {func.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        func.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {func.status}
                      </span>
                    </div>
                    <p className="text-xs cyber-text-secondary mb-3">
                      {func.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs cyber-text-muted">
                        {func.category.toUpperCase()}
                      </span>
                      <button className="text-xs bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded transition-colors duration-200">
                        Visualize
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Live Attack Feed */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold cyber-text-primary mb-4 text-center">
            Live Attack Visualization Feed
          </h2>
          <div className="space-y-4">
            {attacks.map((attack) => (
              <div
                key={attack.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold cyber-text-primary">
                    {attack.type}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(attack.severity)}`}>
                    {attack.severity}
                  </span>
                </div>
                <p className="text-sm cyber-text-secondary mb-2">
                  {attack.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs cyber-text-muted">
                  <div>
                    <span className="font-semibold">Source:</span> {attack.source.country}
                  </div>
                  <div>
                    <span className="font-semibold">Target:</span> {attack.target.country}
                  </div>
                </div>
                <div className="mt-2 text-xs cyber-text-muted">
                  <span className="font-semibold">Time:</span> {new Date(attack.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis Modal */}
        {showAnalysis && selectedAttack && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold cyber-text-primary">
                    {selectedAttack.name} Analysis
                  </h2>
                  <button
                    onClick={closeAnalysis}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Description</h3>
                    <p className="text-sm cyber-text-secondary">
                      {selectedAttack.description}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Status</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      selectedAttack.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {selectedAttack.status}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Category</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
                      {selectedAttack.category.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200">
                    Generate Report
                  </button>
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200">
                    Export Data
                  </button>
                  <button
                    onClick={closeAnalysis}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Globe3DVisualization;

