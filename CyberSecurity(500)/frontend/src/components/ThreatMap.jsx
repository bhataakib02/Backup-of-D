import React, { useState, useEffect } from 'react';
import { createProfessionalText, createSecondaryText, createMutedText, createAccentText } from '../utils/rainbowText';

const ThreatMap = () => {
  const [threats, setThreats] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCountryAnalysis, setShowCountryAnalysis] = useState(false);
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0, zoom: 1 });
  const [selectedCountryForZoom, setSelectedCountryForZoom] = useState(null);

  const reportToAuthorities = (threat) => {
    // Simulate reporting to authorities
    const reportData = {
      threatId: threat.id,
      country: threat.name,
      threatCount: threat.threats,
      type: threat.type,
      severity: threat.severity,
      timestamp: threat.timestamp,
      confidence: threat.confidence,
      reportedAt: new Date().toISOString(),
      status: 'REPORTED'
    };

    // In a real application, this would send data to law enforcement APIs
    console.log('Reporting country threat to authorities:', reportData);
    
    // Show confirmation
    alert(`Country threat reported to authorities successfully!\n\nCountry: ${threat.name}\nThreat Count: ${threat.threats}\nType: ${threat.type}\nSeverity: ${threat.severity}\n\nReport ID: ${Date.now()}`);
    
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
      country: threat.name,
      threatCount: threat.threats,
      trackingStarted: new Date().toISOString(),
      status: 'TRACKING_ACTIVE',
      monitoringLevel: 'HIGH',
      assignedAgent: `Agent-${Math.floor(Math.random() * 1000)}`
    };

    // In a real application, this would start real-time monitoring
    console.log('Starting country activity tracking:', trackingData);
    
    // Show confirmation
    alert(`Country activity tracking started!\n\nCountry: ${threat.name}\nThreat Count: ${threat.threats}\nType: ${threat.type}\n\nTracking ID: ${Date.now()}\nAssigned Agent: ${trackingData.assignedAgent}\n\nYou will receive real-time updates on this country's threat activity.`);
    
    // Update threat status
    setThreats(prevThreats => 
      prevThreats.map(t => 
        t.id === threat.id 
          ? { ...t, status: 'Tracking Active', trackingStarted: new Date(), assignedAgent: trackingData.assignedAgent }
          : t
      )
    );
  };

  // Simulate real-time threat data with geographic coordinates
  useEffect(() => {
    const generateThreatData = () => {
      const countries = [
        { name: 'United States', lat: 39.8283, lng: -98.5795, threats: Math.floor(Math.random() * 50) + 10 },
        { name: 'China', lat: 35.8617, lng: 104.1954, threats: Math.floor(Math.random() * 40) + 8 },
        { name: 'Russia', lat: 61.5240, lng: 105.3188, threats: Math.floor(Math.random() * 35) + 6 },
        { name: 'Germany', lat: 51.1657, lng: 10.4515, threats: Math.floor(Math.random() * 30) + 5 },
        { name: 'United Kingdom', lat: 55.3781, lng: -3.4360, threats: Math.floor(Math.random() * 25) + 4 },
        { name: 'France', lat: 46.2276, lng: 2.2137, threats: Math.floor(Math.random() * 20) + 3 },
        { name: 'Japan', lat: 36.2048, lng: 138.2529, threats: Math.floor(Math.random() * 18) + 3 },
        { name: 'South Korea', lat: 35.9078, lng: 127.7669, threats: Math.floor(Math.random() * 15) + 2 },
        { name: 'India', lat: 20.5937, lng: 78.9629, threats: Math.floor(Math.random() * 25) + 4 },
        { name: 'Brazil', lat: -14.2350, lng: -51.9253, threats: Math.floor(Math.random() * 20) + 3 },
        { name: 'Canada', lat: 56.1304, lng: -106.3468, threats: Math.floor(Math.random() * 15) + 2 },
        { name: 'Australia', lat: -25.2744, lng: 133.7751, threats: Math.floor(Math.random() * 12) + 2 },
        { name: 'Italy', lat: 41.8719, lng: 12.5674, threats: Math.floor(Math.random() * 18) + 3 },
        { name: 'Spain', lat: 40.4637, lng: -3.7492, threats: Math.floor(Math.random() * 16) + 2 },
        { name: 'Netherlands', lat: 52.1326, lng: 5.2913, threats: Math.floor(Math.random() * 14) + 2 },
        { name: 'Sweden', lat: 60.1282, lng: 18.6435, threats: Math.floor(Math.random() * 12) + 2 },
        { name: 'Norway', lat: 60.4720, lng: 8.4689, threats: Math.floor(Math.random() * 10) + 1 },
        { name: 'Finland', lat: 61.9241, lng: 25.7482, threats: Math.floor(Math.random() * 8) + 1 },
        { name: 'Poland', lat: 51.9194, lng: 19.1451, threats: Math.floor(Math.random() * 15) + 2 },
        { name: 'Turkey', lat: 38.9637, lng: 35.2433, threats: Math.floor(Math.random() * 12) + 2 }
      ];

      const threatTypes = [
        'DDoS Attack', 'Phishing Campaign', 'Malware Distribution', 'Ransomware Attack',
        'Data Breach', 'Botnet Activity', 'Cryptocurrency Mining', 'Social Engineering'
      ];

      const newThreats = countries.map(country => ({
        ...country,
        id: Date.now() + Math.random(),
        type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
        severity: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)],
        timestamp: new Date(Date.now() - Math.random() * 3600000),
        confidence: Math.floor(Math.random() * 40) + 60
      }));

      setThreats(newThreats);
      setIsLoading(false);
    };

    generateThreatData();
    const interval = setInterval(generateThreatData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getThreatColor = (threatCount) => {
    if (threatCount > 30) return 'rgba(220, 38, 38, 0.8)'; // Red
    if (threatCount > 20) return 'rgba(245, 158, 11, 0.8)'; // Orange
    if (threatCount > 10) return 'rgba(59, 130, 246, 0.8)'; // Blue
    return 'rgba(34, 197, 94, 0.8)'; // Green
  };

  const getThreatSize = (threatCount) => {
    return Math.max(12, Math.min(40, threatCount / 1.5));
  };

  const handleMapMove = (direction) => {
    const moveStep = 50;
    const zoomStep = 0.2;
    
    switch (direction) {
      case 'up':
        setMapPosition(prev => ({ ...prev, y: prev.y + moveStep }));
        break;
      case 'down':
        setMapPosition(prev => ({ ...prev, y: prev.y - moveStep }));
        break;
      case 'left':
        setMapPosition(prev => ({ ...prev, x: prev.x + moveStep }));
        break;
      case 'right':
        setMapPosition(prev => ({ ...prev, x: prev.x - moveStep }));
        break;
      case 'zoomIn':
        setMapPosition(prev => ({ ...prev, zoom: Math.min(prev.zoom + zoomStep, 3) }));
        break;
      case 'zoomOut':
        setMapPosition(prev => ({ ...prev, zoom: Math.max(prev.zoom - zoomStep, 0.5) }));
        break;
      default:
        break;
    }
  };

  const handleCountryClick = (country) => {
    setSelectedCountryForZoom(country);
    // Zoom to country coordinates
    setMapPosition({
      x: -country.lng * 2,
      y: country.lat * 2,
      zoom: 2.5
    });
  };

  const countries = [
    { name: 'United States', lat: 39.8283, lng: -98.5795, threats: 45, flag: '🇺🇸' },
    { name: 'China', lat: 35.8617, lng: 104.1954, threats: 38, flag: '🇨🇳' },
    { name: 'Russia', lat: 61.5240, lng: 105.3188, threats: 32, flag: '🇷🇺' },
    { name: 'India', lat: 20.5937, lng: 78.9629, threats: 28, flag: '🇮🇳' },
    { name: 'Brazil', lat: -14.2350, lng: -51.9253, threats: 25, flag: '🇧🇷' },
    { name: 'Germany', lat: 51.1657, lng: 10.4515, threats: 22, flag: '🇩🇪' },
    { name: 'Japan', lat: 36.2048, lng: 138.2529, threats: 20, flag: '🇯🇵' },
    { name: 'United Kingdom', lat: 55.3781, lng: -3.4360, threats: 18, flag: '🇬🇧' },
    { name: 'France', lat: 46.2276, lng: 2.2137, threats: 16, flag: '🇫🇷' },
    { name: 'Canada', lat: 56.1304, lng: -106.3468, threats: 14, flag: '🇨🇦' },
    { name: 'Australia', lat: -25.2744, lng: 133.7751, threats: 12, flag: '🇦🇺' },
    { name: 'South Korea', lat: 35.9078, lng: 127.7669, threats: 10, flag: '🇰🇷' }
  ];

  return (
    <div className="card-cyber">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold cyber-text-primary">Global Threat Map</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm cyber-accent-green">Live Updates</span>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="cyber-text-muted mt-4">Loading threat map...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Split Layout: 3D Map + Country List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
            
            {/* Left Half: Real World Map with Controls */}
            <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-green-900 rounded-lg p-4 overflow-hidden">
              {/* Arrow Controls - 4 Sides */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
                <button
                  onClick={() => handleMapMove('up')}
                  className="w-10 h-10 bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full flex items-center justify-center text-white text-xl font-bold transition-all duration-200 shadow-lg"
                >
                  ↑
                </button>
              </div>
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                <button
                  onClick={() => handleMapMove('down')}
                  className="w-10 h-10 bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full flex items-center justify-center text-white text-xl font-bold transition-all duration-200 shadow-lg"
                >
                  ↓
                </button>
              </div>
              
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20">
                <button
                  onClick={() => handleMapMove('left')}
                  className="w-10 h-10 bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full flex items-center justify-center text-white text-xl font-bold transition-all duration-200 shadow-lg"
                >
                  ←
                </button>
              </div>
              
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20">
                <button
                  onClick={() => handleMapMove('right')}
                  className="w-10 h-10 bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full flex items-center justify-center text-white text-xl font-bold transition-all duration-200 shadow-lg"
                >
                  →
                </button>
              </div>
              
              {/* Zoom Controls */}
              <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                <button
                  onClick={() => handleMapMove('zoomIn')}
                  className="w-10 h-10 bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full flex items-center justify-center text-white text-xl font-bold transition-all duration-200 shadow-lg"
                >
                  +
                </button>
                <button
                  onClick={() => handleMapMove('zoomOut')}
                  className="w-10 h-10 bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full flex items-center justify-center text-white text-xl font-bold transition-all duration-200 shadow-lg"
                >
                  -
                </button>
              </div>
              {/* Real World Map */}
              <div 
                className="absolute inset-0 flex items-center justify-center transition-transform duration-500"
                style={{
                  transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) scale(${mapPosition.zoom})`
                }}
              >
                <div className="relative w-full h-full">
                  {/* Perfect Real World Map */}
                  <svg viewBox="0 0 1000 500" className="w-full h-full opacity-95">
                    {/* Ocean Background */}
                    <rect x="0" y="0" width="1000" height="500" fill="#1e40af" opacity="0.15"/>
                    
                    {/* Perfect World Map Continents */}
                    <g fill="#4a90e2" stroke="#2c5aa0" strokeWidth="1.5">
                      {/* North America - Perfect shape */}
                      <path d="M60,60 L140,40 L220,50 L300,70 L360,110 L380,160 L370,210 L340,260 L300,300 L250,320 L200,330 L150,320 L100,300 L60,270 L40,230 L30,190 L35,150 L40,110 Z" />
                      
                      {/* South America - Perfect shape */}
                      <path d="M220,320 L280,310 L340,330 L370,370 L360,420 L330,460 L280,480 L230,470 L190,440 L170,400 L180,360 Z" />
                      
                      {/* Europe - Perfect shape */}
                      <path d="M420,60 L480,50 L520,60 L540,80 L530,110 L500,120 L460,110 L440,90 Z" />
                      
                      {/* Africa - Perfect shape */}
                      <path d="M440,120 L500,110 L560,130 L580,170 L570,230 L540,280 L500,300 L460,290 L430,260 L420,220 L425,170 Z" />
                      
                      {/* Asia - Perfect shape */}
                      <path d="M500,40 L700,30 L800,40 L850,70 L870,110 L860,150 L830,180 L770,190 L700,180 L630,160 L570,140 L520,120 L500,80 Z" />
                      
                      {/* Australia - Perfect shape */}
                      <path d="M750,350 L820,340 L860,360 L870,390 L860,420 L820,430 L780,420 L750,390 Z" />
                      
                      {/* Antarctica - Ice continent */}
                      <path d="M50,450 L950,450 L950,480 L50,480 Z" />
                    </g>
                    
                    {/* Perfect Grid Lines */}
                    <g stroke="#ffffff" strokeWidth="0.3" opacity="0.4">
                      {/* Latitude lines */}
                      <line x1="0" y1="60" x2="1000" y2="60" />
                      <line x1="0" y1="110" x2="1000" y2="110" />
                      <line x1="0" y1="160" x2="1000" y2="160" />
                      <line x1="0" y1="210" x2="1000" y2="210" />
                      <line x1="0" y1="260" x2="1000" y2="260" />
                      <line x1="0" y1="310" x2="1000" y2="310" />
                      <line x1="0" y1="360" x2="1000" y2="360" />
                      <line x1="0" y1="410" x2="1000" y2="410" />
                      <line x1="0" y1="460" x2="1000" y2="460" />
                      {/* Longitude lines */}
                      <line x1="100" y1="0" x2="100" y2="500" />
                      <line x1="200" y1="0" x2="200" y2="500" />
                      <line x1="300" y1="0" x2="300" y2="500" />
                      <line x1="400" y1="0" x2="400" y2="500" />
                      <line x1="500" y1="0" x2="500" y2="500" />
                      <line x1="600" y1="0" x2="600" y2="500" />
                      <line x1="700" y1="0" x2="700" y2="500" />
                      <line x1="800" y1="0" x2="800" y2="500" />
                      <line x1="900" y1="0" x2="900" y2="500" />
                    </g>
                    
                    {/* Major Countries - Perfect shapes */}
                    <g fill="#3b82f6" stroke="#1e40af" strokeWidth="1" opacity="0.7">
                      {/* United States */}
                      <path d="M80,100 L150,90 L200,110 L220,140 L200,170 L150,180 L100,170 L80,140 Z" />
                      
                      {/* China */}
                      <path d="M600,80 L700,70 L750,90 L760,120 L740,150 L680,160 L620,150 L600,120 Z" />
                      
                      {/* Russia */}
                      <path d="M500,40 L650,30 L700,50 L720,80 L700,110 L650,120 L550,110 L500,80 Z" />
                      
                      {/* India */}
                      <path d="M580,160 L620,150 L650,170 L660,200 L640,230 L600,240 L580,210 Z" />
                      
                      {/* Brazil */}
                      <path d="M220,350 L280,340 L320,360 L330,390 L310,420 L270,430 L230,410 L220,380 Z" />
                      
                      {/* Canada */}
                      <path d="M100,60 L180,50 L220,70 L240,100 L220,130 L180,140 L140,130 L100,100 Z" />
                      
                      {/* Mexico */}
                      <path d="M80,140 L120,130 L140,150 L130,180 L110,190 L90,180 L80,160 Z" />
                    </g>
                    
                    {/* Perfect Country Labels */}
                    <g fill="#ffffff" fontSize="11" fontFamily="Arial, sans-serif" opacity="0.9">
                      <text x="140" y="130" textAnchor="middle">USA</text>
                      <text x="680" y="110" textAnchor="middle">China</text>
                      <text x="600" y="80" textAnchor="middle">Russia</text>
                      <text x="620" y="180" textAnchor="middle">India</text>
                      <text x="270" y="380" textAnchor="middle">Brazil</text>
                      <text x="140" y="90" textAnchor="middle">Canada</text>
                      <text x="100" y="160" textAnchor="middle">Mexico</text>
                      <text x="460" y="180" textAnchor="middle">Africa</text>
                      <text x="820" y="380" textAnchor="middle">Australia</text>
                      <text x="480" y="80" textAnchor="middle">Europe</text>
                    </g>
                    
                    {/* Major Cities */}
                    <g fill="#ff6b6b" stroke="#ffffff" strokeWidth="1" opacity="0.8">
                      <circle cx="140" cy="130" r="3" />
                      <circle cx="680" cy="110" r="3" />
                      <circle cx="600" cy="80" r="3" />
                      <circle cx="620" cy="180" r="3" />
                      <circle cx="270" cy="380" r="3" />
                      <circle cx="480" cy="80" r="3" />
                      <circle cx="820" cy="380" r="3" />
                    </g>
                  </svg>
                </div>
              </div>
              
            
            
            
            
              {/* Threat Markers on Real World Map */}
              {threats.map((threat) => (
                <div
                  key={threat.id}
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
                  style={{
                    left: `${50 + (threat.lng / 180) * 45}%`,
                    top: `${50 - (threat.lat / 90) * 45}%`,
                  }}
                  onClick={() => {
                    setSelectedCountry(threat);
                    setShowCountryAnalysis(true);
                  }}
                >
                  <div
                    className="rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-125 transition-transform duration-300"
                    style={{
                      width: `${getThreatSize(threat.threats)}px`,
                      height: `${getThreatSize(threat.threats)}px`,
                      backgroundColor: getThreatColor(threat.threats),
                      boxShadow: `0 0 20px ${getThreatColor(threat.threats)}`
                    }}
                  >
                    <div className="w-full h-full rounded-full bg-white bg-opacity-30"></div>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      {threat.name}: {threat.threats} threats
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Right Half: Country List */}
            <div className="bg-gray-800 rounded-lg p-4 overflow-y-auto">
              <h3 className="text-lg font-bold cyber-text-primary mb-4 text-center">Country Threat List</h3>
              <div className="space-y-2">
                {countries.map((country, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
                      selectedCountryForZoom?.name === country.name
                        ? 'bg-cyan-600 border-2 border-cyan-400'
                        : 'bg-gray-700 hover:bg-gray-600 border border-gray-600'
                    }`}
                    onClick={() => handleCountryClick(country)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{country.flag}</span>
                        <div>
                          <div className="font-semibold cyber-text-primary">{country.name}</div>
                          <div className="text-sm cyber-text-secondary">
                            {country.lat.toFixed(2)}°, {country.lng.toFixed(2)}°
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold cyber-accent-red">{country.threats}</div>
                        <div className="text-xs cyber-text-muted">threats</div>
                      </div>
                    </div>
                    {selectedCountryForZoom?.name === country.name && (
                      <div className="mt-2 text-xs cyber-accent-cyan animate-pulse">
                        ✓ Zoomed to {country.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Legend */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <h3 className="text-sm font-semibold cyber-text-primary mb-3 text-center">Threat Level Legend</h3>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-green-500 shadow-lg" style={{boxShadow: '0 0 10px #00aa00'}}></div>
                <span className="cyber-text-muted">Low (1-10)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-blue-500 shadow-lg" style={{boxShadow: '0 0 10px #0066cc'}}></div>
                <span className="cyber-text-muted">Medium (11-20)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-orange-500 shadow-lg" style={{boxShadow: '0 0 10px #ff6600'}}></div>
                <span className="cyber-text-muted">High (21-30)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-red-500 shadow-lg" style={{boxShadow: '0 0 10px #cc0000'}}></div>
                <span className="cyber-text-muted">Critical (30+)</span>
              </div>
            </div>
          </div>

          {/* Country Details */}
          {selectedCountry && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold cyber-text-primary">{selectedCountry.name}</h3>
                <button
                  onClick={() => {
                    setSelectedCountry(null);
                    setShowCountryAnalysis(false);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="cyber-text-muted">Active Threats:</span>
                  <span className="ml-2 cyber-accent-red font-semibold">{selectedCountry.threats}</span>
                </div>
                <div>
                  <span className="cyber-text-muted">Threat Type:</span>
                  <span className="ml-2 cyber-text-secondary">{selectedCountry.type}</span>
                </div>
                <div>
                  <span className="cyber-text-muted">Severity:</span>
                  <span className="ml-2 cyber-accent-orange">{selectedCountry.severity}</span>
                </div>
                <div>
                  <span className="cyber-text-muted">Confidence:</span>
                  <span className="ml-2 cyber-accent-cyan">{selectedCountry.confidence}%</span>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={() => setShowCountryAnalysis(true)}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Analyze Criminal Activity
                </button>
              </div>
            </div>
          )}

          {/* Top Countries by Threat Count */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 cyber-text-primary">Top Countries by Threat Count</h3>
            <div className="space-y-2">
              {threats
                .sort((a, b) => b.threats - a.threats)
                .slice(0, 10)
                .map((threat, index) => (
                  <div key={threat.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm cyber-text-muted">#{index + 1}</span>
                      <span className="cyber-text-secondary">{threat.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getThreatColor(threat.threats) }}
                      ></div>
                      <span className="cyber-accent-red font-semibold">{threat.threats}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Country Analysis Modal */}
      {showCountryAnalysis && selectedCountry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold cyber-text-primary">Criminal Activity Analysis - {selectedCountry.name}</h2>
                <button
                  onClick={() => setShowCountryAnalysis(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Risk Assessment */}
                <div className="card-cyber">
                  <h3 className="text-lg font-semibold mb-4 cyber-text-primary">Risk Assessment</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="text-2xl font-bold cyber-accent-red">{selectedCountry.threats}</div>
                      <div className="text-sm cyber-text-muted">Active Threats</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-2xl font-bold cyber-accent-orange">{selectedCountry.severity}</div>
                      <div className="text-sm cyber-text-muted">Threat Level</div>
                    </div>
                  </div>
                </div>

                {/* Criminal Activity Indicators */}
                <div className="card-cyber">
                  <h3 className="text-lg font-semibold mb-4 cyber-text-primary">Criminal Activity Indicators</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="cyber-text-secondary">Cybercrime Rate</span>
                      <span className="cyber-accent-red font-semibold">High</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="cyber-text-secondary">Law Enforcement Response</span>
                      <span className="cyber-accent-cyan font-semibold">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="cyber-text-secondary">International Cooperation</span>
                      <span className="cyber-accent-green font-semibold">Good</span>
                    </div>
                  </div>
                </div>

                {/* Threat Types */}
                <div className="card-cyber">
                  <h3 className="text-lg font-semibold mb-4 cyber-text-primary">Common Threat Types</h3>
                  <div className="space-y-2">
                    {['DDoS Attacks', 'Phishing Campaigns', 'Ransomware', 'Data Breaches'].map((type, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <span className="cyber-text-secondary">{type}</span>
                        <span className="cyber-accent-orange text-sm">Frequent</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowCountryAnalysis(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => reportToAuthorities(selectedCountry)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Report to Authorities
                  </button>
                  <button 
                    onClick={() => trackActivity(selectedCountry)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Track Activity
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreatMap;
