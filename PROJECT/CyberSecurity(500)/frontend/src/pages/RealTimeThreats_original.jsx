import React, { useState, useEffect } from 'react';
import { createProfessionalText, createSecondaryText, createMutedText, createAccentText } from '../utils/rainbowText';
import ThreatMap from '../components/ThreatMap';
import threatIntelligenceService from '../services/threatIntelligence';

const RealTimeThreats = () => {
  const [threats, setThreats] = useState([]);
  const [stats, setStats] = useState({
    totalThreats: 0,
    activeAttacks: 0,
    countriesAffected: 0,
    lastUpdate: new Date()
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('global');
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [mapView, setMapView] = useState('enhanced'); // 'basic' or 'enhanced'

  // Real-time threat data using threat intelligence service
  useEffect(() => {
    const handleThreatUpdate = ({ threats: newThreats, stats: newStats }) => {
      setThreats(prevThreats => [...newThreats, ...prevThreats].slice(0, 50)); // Keep last 50 threats
      setStats(newStats);
      setIsLoading(false);
    };

    // Start real-time feed
    const intervalId = threatIntelligenceService.startRealTimeFeed(handleThreatUpdate, 30000);

    return () => {
      threatIntelligenceService.stopRealTimeFeed(intervalId);
    };
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'cyber-accent-red';
      case 'High': return 'cyber-accent-orange';
      case 'Medium': return 'cyber-accent-cyan';
      case 'Low': return 'cyber-accent-green';
      default: return 'cyber-accent-gray';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'cyber-accent-red';
      case 'Contained': return 'cyber-accent-orange';
      case 'Investigating': return 'cyber-accent-cyan';
      case 'Resolved': return 'cyber-accent-green';
      default: return 'cyber-accent-gray';
    }
  };

  const handleAnalyzeThreat = (threat) => {
    setSelectedThreat(threat);
    setShowAnalysis(true);
  };

  const closeAnalysis = () => {
    setShowAnalysis(false);
    setSelectedThreat(null);
  };

  const reportToAuthorities = (threat) => {
    // Simulate reporting to authorities
    const reportData = {
      threatId: threat.id,
      type: threat.type,
      country: threat.country,
      severity: threat.severity,
      timestamp: threat.timestamp,
      confidence: threat.confidence,
      affectedSystems: threat.affectedSystems,
      source: threat.source,
      reportedAt: new Date().toISOString(),
      status: 'REPORTED'
    };

    // In a real application, this would send data to law enforcement APIs
    console.log('Reporting to authorities:', reportData);
    
    // Show confirmation
    alert(`Threat reported to authorities successfully!\n\nThreat ID: ${threat.id}\nType: ${threat.type}\nCountry: ${threat.country}\nSeverity: ${threat.severity}\n\nReport ID: ${Date.now()}`);
    
    // Update threat status
    setThreats(prevThreats => 
      prevThreats.map(t => 
        t.id === threat.id 
          ? { ...t, status: 'Reported to Authorities', reportedAt: new Date() }
          : t
      )
    );
  };

  const trackActivity = (threat) => {
    // Simulate starting activity tracking
    const trackingData = {
      threatId: threat.id,
      type: threat.type,
      country: threat.country,
      trackingStarted: new Date().toISOString(),
      status: 'TRACKING_ACTIVE',
      monitoringLevel: 'HIGH',
      assignedAgent: `Agent-${Math.floor(Math.random() * 1000)}`
    };

    // In a real application, this would start real-time monitoring
    console.log('Starting activity tracking:', trackingData);
    
    // Show confirmation
    alert(`Activity tracking started!\n\nThreat ID: ${threat.id}\nType: ${threat.type}\nCountry: ${threat.country}\n\nTracking ID: ${Date.now()}\nAssigned Agent: ${trackingData.assignedAgent}\n\nYou will receive real-time updates on this threat.`);
    
    // Update threat status
    setThreats(prevThreats => 
      prevThreats.map(t => 
        t.id === threat.id 
          ? { ...t, status: 'Tracking Active', trackingStarted: new Date(), assignedAgent: trackingData.assignedAgent }
          : t
      )
    );
  };

  const regions = [
    { value: 'global', label: 'Global' },
    { value: 'north-america', label: 'North America' },
    { value: 'europe', label: 'Europe' },
    { value: 'asia', label: 'Asia' },
    { value: 'africa', label: 'Africa' },
    { value: 'south-america', label: 'South America' },
    { value: 'oceania', label: 'Oceania' }
  ];

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold cyber-text-primary">
            Real-Time Global Cybercrime Analysis
          </h1>
          <p className="text-sm cyber-text-secondary mt-1">
            Live monitoring of cyber threats worldwide
          </p>
          <div className="flex items-center justify-center space-x-4 mt-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs cyber-text-muted">Live Feed Active</span>
            </div>
            <div className="text-xs cyber-text-muted">
              Last Update: {stats.lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-cyber">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm cyber-text-muted">Total Threats</p>
              <p className="text-2xl font-bold cyber-accent-red">{stats.totalThreats}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 cyber-accent-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card-cyber">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm cyber-text-muted">Active Attacks</p>
              <p className="text-2xl font-bold cyber-accent-orange">{stats.activeAttacks}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 cyber-accent-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card-cyber">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm cyber-text-muted">Countries Affected</p>
              <p className="text-2xl font-bold cyber-accent-cyan">{stats.countriesAffected}</p>
            </div>
            <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 cyber-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card-cyber">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm cyber-text-muted">Threat Level</p>
              <p className="text-2xl font-bold cyber-accent-red">HIGH</p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 cyber-accent-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Global Threat Map */}
      <ThreatMap />

      {/* Region Filter */}
      <div className="card-cyber">
        <h2 className="text-xl font-bold mb-4 cyber-text-primary">Regional Analysis</h2>
        <div className="flex flex-wrap gap-2">
          {regions.map((region) => (
            <button
              key={region.value}
              onClick={() => setSelectedRegion(region.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedRegion === region.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 cyber-text-secondary hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {region.label}
            </button>
          ))}
        </div>
      </div>

      {/* Real-Time Threats List */}
      <div className="card-cyber">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold cyber-text-primary">Live Threat Feed</h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm cyber-accent-green">Real-Time</span>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="cyber-text-muted mt-4">Loading threat data...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {threats.map((threat) => (
              <div
                key={threat.id}
                className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold cyber-text-primary">{threat.type}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(threat.severity)}`}>
                        {threat.severity}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(threat.status)}`}>
                        {threat.status}
                      </span>
                    </div>
                    <p className="text-sm cyber-text-secondary mb-2">{threat.description}</p>
                    <div className="flex items-center space-x-4 text-xs cyber-text-muted">
                      <span>📍 {threat.country}</span>
                      <span>🕒 {threat.timestamp.toLocaleTimeString()}</span>
                      <span>📊 {threat.confidence}% confidence</span>
                      <span>💻 {threat.affectedSystems} systems</span>
                      <span>📡 {threat.source}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <button 
                      onClick={() => handleAnalyzeThreat(threat)}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Analyze
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Threat Intelligence Sources */}
      <div className="card-cyber">
        <h2 className="text-xl font-bold mb-4 cyber-text-primary">Threat Intelligence Sources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'CISA Feed', status: 'Active', threats: 45 },
            { name: 'MITRE ATT&CK', status: 'Active', threats: 32 },
            { name: 'VirusTotal', status: 'Active', threats: 28 },
            { name: 'ThreatConnect', status: 'Active', threats: 19 },
            { name: 'AlienVault OTX', status: 'Active', threats: 15 },
            { name: 'MISP', status: 'Active', threats: 12 }
          ].map((source, index) => (
            <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <h3 className="font-medium cyber-text-primary">{source.name}</h3>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-full text-xs">
                  {source.status}
                </span>
              </div>
              <p className="text-sm cyber-text-muted mt-1">{source.threats} threats detected</p>
            </div>
          ))}
        </div>
      </div>

      {/* Threat Analysis Modal */}
      {showAnalysis && selectedThreat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold cyber-text-primary">Threat Analysis Report</h2>
                <button
                  onClick={closeAnalysis}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Threat Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="card-cyber">
                  <h3 className="text-lg font-semibold mb-4 cyber-text-primary">Threat Overview</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="cyber-text-muted">Type:</span>
                      <span className="cyber-text-secondary">{selectedThreat.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="cyber-text-muted">Country:</span>
                      <span className="cyber-text-secondary">{selectedThreat.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="cyber-text-muted">Severity:</span>
                      <span className={`font-semibold ${getSeverityColor(selectedThreat.severity)}`}>
                        {selectedThreat.severity}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="cyber-text-muted">Status:</span>
                      <span className={`font-semibold ${getStatusColor(selectedThreat.status)}`}>
                        {selectedThreat.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="cyber-text-muted">Confidence:</span>
                      <span className="cyber-accent-cyan font-semibold">{selectedThreat.confidence}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="cyber-text-muted">Affected Systems:</span>
                      <span className="cyber-accent-red font-semibold">{selectedThreat.affectedSystems}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="cyber-text-muted">Source:</span>
                      <span className="cyber-text-secondary">{selectedThreat.source}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="cyber-text-muted">Detected:</span>
                      <span className="cyber-text-secondary">{selectedThreat.timestamp.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="card-cyber">
                  <h3 className="text-lg font-semibold mb-4 cyber-text-primary">Description</h3>
                  <p className="cyber-text-secondary text-sm leading-relaxed">
                    {selectedThreat.description}
                  </p>
                  
                  {selectedThreat.impact && (
                    <div className="mt-4">
                      <h4 className="font-semibold cyber-text-primary mb-2">Impact Assessment</h4>
                      <p className="cyber-text-secondary text-sm">{selectedThreat.impact}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Indicators */}
              {selectedThreat.indicators && selectedThreat.indicators.length > 0 && (
                <div className="card-cyber mb-6">
                  <h3 className="text-lg font-semibold mb-4 cyber-text-primary">Threat Indicators</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedThreat.indicators.map((indicator, index) => (
                      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium cyber-text-primary">{indicator.type}</span>
                          <span className="text-xs cyber-accent-cyan">{indicator.confidence}% confidence</span>
                        </div>
                        <p className="text-sm cyber-text-secondary font-mono break-all">{indicator.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {selectedThreat.recommendations && selectedThreat.recommendations.length > 0 && (
                <div className="card-cyber mb-6">
                  <h3 className="text-lg font-semibold mb-4 cyber-text-primary">Security Recommendations</h3>
                  <ul className="space-y-2">
                    {selectedThreat.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                        <span className="cyber-text-secondary text-sm">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Criminal Activity Tracking */}
              <div className="card-cyber mb-6">
                <h3 className="text-lg font-semibold mb-4 cyber-text-primary">Criminal Activity Tracking</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="text-2xl font-bold cyber-accent-red">HIGH</div>
                    <div className="text-sm cyber-text-muted">Risk Level</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-2xl font-bold cyber-accent-orange">ACTIVE</div>
                    <div className="text-sm cyber-text-muted">Criminal Status</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold cyber-accent-cyan">TRACKING</div>
                    <div className="text-sm cyber-text-muted">Monitoring Status</div>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <h4 className="font-semibold cyber-text-primary mb-2">⚠️ Law Enforcement Alert</h4>
                  <p className="cyber-text-secondary text-sm">
                    This threat has been flagged for potential criminal activity. 
                    Automated alerts have been sent to relevant law enforcement agencies 
                    and cybersecurity organizations for further investigation.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={closeAnalysis}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
                <button 
                  onClick={() => reportToAuthorities(selectedThreat)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Report to Authorities
                </button>
                <button 
                  onClick={() => trackActivity(selectedThreat)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Track Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimeThreats;
