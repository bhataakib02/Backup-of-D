import React, { useState, useEffect } from 'react';
import { createProfessionalText, createSecondaryText, createMutedText, createAccentText } from '../utils/rainbowText';

const EncryptedTrafficAnalysis = () => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisInput, setAnalysisInput] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);

  const trafficFunctions = [
    // Encrypted Traffic Analysis (40 Functions)
    { id: 1, name: 'JA3 Fingerprinting', category: 'ja3', description: 'Generate JA3 fingerprints for TLS clients', status: 'active' },
    { id: 2, name: 'JA3S Fingerprinting', category: 'ja3s', description: 'Generate JA3S fingerprints for TLS servers', status: 'active' },
    { id: 3, name: 'TLS Version Analysis', category: 'tls', description: 'Analyze TLS protocol versions', status: 'active' },
    { id: 4, name: 'Cipher Suite Analysis', category: 'ciphers', description: 'Analyze cipher suite usage', status: 'active' },
    { id: 5, name: 'Certificate Analysis', category: 'certs', description: 'Analyze SSL/TLS certificates', status: 'active' },
    { id: 6, name: 'SNI Analysis', category: 'sni', description: 'Analyze Server Name Indication', status: 'active' },
    { id: 7, name: 'ALPN Analysis', category: 'alpn', description: 'Analyze Application Layer Protocol Negotiation', status: 'active' },
    { id: 8, name: 'TLS Extension Analysis', category: 'extensions', description: 'Analyze TLS extensions', status: 'active' },
    { id: 9, name: 'TLS Handshake Analysis', category: 'handshake', description: 'Analyze TLS handshake patterns', status: 'active' },
    { id: 10, name: 'TLS Session Resumption', category: 'resumption', description: 'Analyze TLS session resumption', status: 'active' },
    { id: 11, name: 'TLS Compression Analysis', category: 'compression', description: 'Analyze TLS compression usage', status: 'active' },
    { id: 12, name: 'TLS Renegotiation', category: 'renegotiation', description: 'Analyze TLS renegotiation', status: 'active' },
    { id: 13, name: 'TLS Heartbeat Analysis', category: 'heartbeat', description: 'Analyze TLS heartbeat extension', status: 'active' },
    { id: 14, name: 'TLS Fallback Detection', category: 'fallback', description: 'Detect TLS fallback attacks', status: 'active' },
    { id: 15, name: 'TLS Downgrade Detection', category: 'downgrade', description: 'Detect TLS downgrade attacks', status: 'active' },
    { id: 16, name: 'TLS Padding Oracle', category: 'padding', description: 'Detect TLS padding oracle attacks', status: 'active' },
    { id: 17, name: 'TLS Timing Analysis', category: 'timing', description: 'Analyze TLS timing patterns', status: 'active' },
    { id: 18, name: 'TLS Length Analysis', category: 'length', description: 'Analyze TLS record lengths', status: 'active' },
    { id: 19, name: 'TLS Frequency Analysis', category: 'frequency', description: 'Analyze TLS frequency patterns', status: 'active' },
    { id: 20, name: 'TLS Entropy Analysis', category: 'entropy', description: 'Analyze TLS entropy patterns', status: 'active' },
    { id: 21, name: 'TLS Metadata Analysis', category: 'metadata', description: 'Analyze TLS metadata', status: 'active' },
    { id: 22, name: 'TLS Behavioral Analysis', category: 'behavior', description: 'Analyze TLS behavioral patterns', status: 'active' },
    { id: 23, name: 'TLS Anomaly Detection', category: 'anomaly', description: 'Detect TLS anomalies', status: 'active' },
    { id: 24, name: 'TLS Machine Learning', category: 'ml', description: 'ML-based TLS analysis', status: 'active' },
    { id: 25, name: 'TLS Deep Learning', category: 'dl', description: 'Deep learning TLS analysis', status: 'active' },
    { id: 26, name: 'TLS Graph Analysis', category: 'graph', description: 'Graph-based TLS analysis', status: 'active' },
    { id: 27, name: 'TLS Clustering', category: 'clustering', description: 'Cluster TLS sessions', status: 'active' },
    { id: 28, name: 'TLS Classification', category: 'classification', description: 'Classify TLS sessions', status: 'active' },
    { id: 29, name: 'TLS Prediction', category: 'prediction', description: 'Predict TLS behavior', status: 'active' },
    { id: 30, name: 'TLS Correlation', category: 'correlation', description: 'Correlate TLS sessions', status: 'active' },
    { id: 31, name: 'TLS Attribution', category: 'attribution', description: 'Attribute TLS sessions', status: 'active' },
    { id: 32, name: 'TLS Threat Intelligence', category: 'intelligence', description: 'TLS threat intelligence', status: 'active' },
    { id: 33, name: 'TLS Forensics', category: 'forensics', description: 'TLS forensic analysis', status: 'active' },
    { id: 34, name: 'TLS Compliance', category: 'compliance', description: 'TLS compliance checking', status: 'active' },
    { id: 35, name: 'TLS Performance', category: 'performance', description: 'TLS performance analysis', status: 'active' },
    { id: 36, name: 'TLS Security', category: 'security', description: 'TLS security assessment', status: 'active' },
    { id: 37, name: 'TLS Monitoring', category: 'monitoring', description: 'TLS monitoring and alerting', status: 'active' },
    { id: 38, name: 'TLS Reporting', category: 'reporting', description: 'TLS reporting and visualization', status: 'active' },
    { id: 39, name: 'TLS Automation', category: 'automation', description: 'TLS analysis automation', status: 'active' },
    { id: 40, name: 'TLS Integration', category: 'integration', description: 'TLS system integration', status: 'active' }
  ];

  const categoryTitles = {
    ja3: 'JA3 Fingerprinting',
    ja3s: 'JA3S Fingerprinting',
    tls: 'TLS Version Analysis',
    ciphers: 'Cipher Suite Analysis',
    certs: 'Certificate Analysis',
    sni: 'SNI Analysis',
    alpn: 'ALPN Analysis',
    extensions: 'TLS Extensions',
    handshake: 'Handshake Analysis',
    resumption: 'Session Resumption',
    compression: 'Compression Analysis',
    renegotiation: 'Renegotiation',
    heartbeat: 'Heartbeat Analysis',
    fallback: 'Fallback Detection',
    downgrade: 'Downgrade Detection',
    padding: 'Padding Oracle',
    timing: 'Timing Analysis',
    length: 'Length Analysis',
    frequency: 'Frequency Analysis',
    entropy: 'Entropy Analysis',
    metadata: 'Metadata Analysis',
    behavior: 'Behavioral Analysis',
    anomaly: 'Anomaly Detection',
    ml: 'Machine Learning',
    dl: 'Deep Learning',
    graph: 'Graph Analysis',
    clustering: 'Clustering',
    classification: 'Classification',
    prediction: 'Prediction',
    correlation: 'Correlation',
    attribution: 'Attribution',
    intelligence: 'Threat Intelligence',
    forensics: 'Forensics',
    compliance: 'Compliance',
    performance: 'Performance',
    security: 'Security Assessment',
    monitoring: 'Monitoring',
    reporting: 'Reporting',
    automation: 'Automation',
    integration: 'Integration'
  };

  useEffect(() => {
    // Simulate loading sessions
    const timer = setTimeout(() => {
      setIsLoading(false);
      setSessions([
        {
          id: 1,
          ja3: '769,47-53-5-10-49161-49162-49171-49172-50-56-19-4,0-10-11,23-24-25,0',
          ja3s: '769,47-53-5-10-49161-49162-49171-49172-50-56-19-4,0-10-11,23-24-25,0',
          tlsVersion: 'TLS 1.3',
          cipherSuite: 'TLS_AES_256_GCM_SHA384',
          serverName: 'malicious-domain.com',
          certificate: 'Self-signed certificate detected',
          severity: 'High',
          confidence: 92,
          timestamp: new Date().toISOString(),
          sourceIP: '192.168.1.100',
          destinationIP: '10.0.0.50',
          port: 443,
          detection: 'JA3 fingerprinting, certificate analysis'
        },
        {
          id: 2,
          ja3: '769,47-53-5-10-49161-49162-49171-49172-50-56-19-4,0-10-11,23-24-25,0',
          ja3s: '769,47-53-5-10-49161-49162-49171-49172-50-56-19-4,0-10-11,23-24-25,0',
          tlsVersion: 'TLS 1.2',
          cipherSuite: 'TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384',
          serverName: 'legitimate-site.com',
          certificate: 'Valid certificate from trusted CA',
          severity: 'Low',
          confidence: 85,
          timestamp: new Date().toISOString(),
          sourceIP: '192.168.1.101',
          destinationIP: '8.8.8.8',
          port: 443,
          detection: 'JA3 fingerprinting, SNI analysis'
        },
        {
          id: 3,
          ja3: '769,47-53-5-10-49161-49162-49171-49172-50-56-19-4,0-10-11,23-24-25,0',
          ja3s: '769,47-53-5-10-49161-49162-49171-49172-50-56-19-4,0-10-11,23-24-25,0',
          tlsVersion: 'TLS 1.1',
          cipherSuite: 'TLS_RSA_WITH_AES_128_CBC_SHA',
          serverName: 'suspicious-domain.net',
          certificate: 'Expired certificate',
          severity: 'Medium',
          confidence: 78,
          timestamp: new Date().toISOString(),
          sourceIP: '192.168.1.102',
          destinationIP: '172.16.0.10',
          port: 443,
          detection: 'TLS version analysis, cipher suite analysis'
        }
      ]);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'text-red-500';
      case 'Medium': return 'text-orange-500';
      case 'Low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const handleAnalyzeSession = (session) => {
    setSelectedSession(session);
    setShowAnalysis(true);
  };

  const closeAnalysis = () => {
    setShowAnalysis(false);
    setSelectedSession(null);
    setAnalysisResults(null);
  };

  const executeTrafficAnalysis = async () => {
    if (!analysisInput.trim()) return;
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      const mockResults = {
        threatLevel: Math.random() > 0.5 ? 'High' : 'Medium',
        confidence: Math.floor(Math.random() * 20) + 80,
        ja3Fingerprints: Math.floor(Math.random() * 15) + 5,
        tlsVersions: ['TLS 1.2', 'TLS 1.3'],
        cipherSuites: Math.floor(Math.random() * 10) + 3,
        anomaliesDetected: Math.floor(Math.random() * 8) + 2,
        recommendations: ['Update TLS configurations', 'Monitor certificate usage', 'Enable advanced logging']
      };
      setAnalysisResults(mockResults);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateReport = async () => {
    if (!selectedSession) return;
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const report = {
        id: `ETA-${Date.now()}`,
        title: `Encrypted Traffic Analysis Report: ${selectedSession.protocol}`,
        generated: new Date().toISOString(),
        classification: 'CONFIDENTIAL - TRAFFIC ANALYSIS',
        summary: `Comprehensive analysis of encrypted traffic reveals TLS/SSL patterns and potential security issues.`,
        keyFindings: ['JA3 fingerprints identified', 'TLS version analysis completed', 'Cipher suite evaluation performed'],
        recommendations: ['Implement TLS monitoring', 'Update cipher configurations', 'Deploy traffic analysis tools'],
        technicalDetails: { analysisMethod: 'TLS Fingerprinting', confidence: 88, riskScore: 75 }
      };
      setReportData(report);
      setShowReport(true);
    } catch (error) {
      console.error('Report generation failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const exportData = async () => {
    if (!selectedSession) return;
    try {
      const exportData = { session: selectedSession, analysisResults, timestamp: new Date().toISOString(), format: 'JSON', source: 'Encrypted Traffic Analysis System' };
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `encrypted-traffic-analysis-${selectedSession.id}-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      alert('Encrypted traffic analysis data exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="cyber-text-muted mt-4">Loading encrypted traffic analysis...</p>
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
            Encrypted Traffic Analysis
          </h1>
          <p className="cyber-text-secondary">
            Advanced TLS/SSL fingerprinting and encrypted traffic analysis with JA3/JA3S
          </p>
        </div>

        {/* Master Input */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={analysisInput}
              onChange={(e) => setAnalysisInput(e.target.value)}
              placeholder="Enter JA3/JA3S fingerprint, domain, or IP for encrypted traffic analysis..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button 
              onClick={executeTrafficAnalysis}
              disabled={isAnalyzing || !analysisInput.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors duration-200"
            >
              {isAnalyzing ? 'Analyzing...' : 'Execute Traffic Analysis'}
            </button>
          </div>
          {analysisResults && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold cyber-text-primary mb-3">Encrypted Traffic Analysis Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-sm cyber-text-muted">Threat Level</p>
                  <p className="text-xl font-bold text-orange-500">{analysisResults.threatLevel}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm cyber-text-muted">Confidence</p>
                  <p className="text-xl font-bold text-blue-500">{analysisResults.confidence}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm cyber-text-muted">JA3 Fingerprints</p>
                  <p className="text-xl font-bold text-green-500">{analysisResults.ja3Fingerprints}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm cyber-text-muted">Anomalies</p>
                  <p className="text-xl font-bold text-red-500">{analysisResults.anomaliesDetected}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Function Categories */}
        {Object.entries(categoryTitles).map(([category, title]) => {
          const categoryFunctions = trafficFunctions.filter(func => func.category === category);
          
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
                    onClick={() => handleAnalyzeSession(func)}
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
                        Analyze
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Live TLS Session Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold cyber-text-primary mb-4 text-center">
            Live TLS Session Analysis
          </h2>
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold cyber-text-primary">
                      TLS Session {session.id}
                    </h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-semibold">
                      {session.tlsVersion}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(session.severity)}`}>
                      {session.severity}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-semibold">
                      {session.confidence}% Confidence
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <span className="text-xs cyber-text-muted font-semibold">JA3:</span>
                    <p className="text-xs cyber-accent-blue font-mono break-all">
                      {session.ja3}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs cyber-text-muted font-semibold">JA3S:</span>
                    <p className="text-xs cyber-accent-blue font-mono break-all">
                      {session.ja3s}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs cyber-text-muted mb-2">
                  <div>
                    <span className="font-semibold">Server:</span> {session.serverName}
                  </div>
                  <div>
                    <span className="font-semibold">Cipher:</span> {session.cipherSuite}
                  </div>
                  <div>
                    <span className="font-semibold">Port:</span> {session.port}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs cyber-text-muted mb-2">
                  <div>
                    <span className="font-semibold">Source:</span> {session.sourceIP}
                  </div>
                  <div>
                    <span className="font-semibold">Destination:</span> {session.destinationIP}
                  </div>
                </div>
                
                <div className="mb-2">
                  <span className="text-xs cyber-text-muted">Certificate: </span>
                  <span className="text-xs cyber-accent-orange">
                    {session.certificate}
                  </span>
                </div>
                
                <div className="mt-2">
                  <span className="text-xs cyber-text-muted">Detection: </span>
                  <span className="text-xs cyber-accent-blue">
                    {session.detection}
                  </span>
                </div>
                
                <div className="mt-2 text-xs cyber-text-muted">
                  <span className="font-semibold">Time:</span> {new Date(session.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis Modal */}
        {showAnalysis && selectedSession && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold cyber-text-primary">
                    {selectedSession.name} Analysis
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
                      {selectedSession.description}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Status</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      selectedSession.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {selectedSession.status}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Category</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
                      {selectedSession.category.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={generateReport}
                    disabled={isAnalyzing}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    {isAnalyzing ? 'Generating...' : 'Generate Report'}
                  </button>
                  <button 
                    onClick={exportData}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                  >
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
        {showReport && reportData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold cyber-text-primary">{reportData.title}</h2>
                  <button onClick={() => setShowReport(false)} className="text-gray-500 hover:text-gray-700">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-4">
                  <p className="text-sm cyber-text-secondary bg-gray-50 dark:bg-gray-700 p-3 rounded">{reportData.summary}</p>
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Key Findings</h3>
                    <ul className="text-sm cyber-text-secondary space-y-1">
                      {reportData.keyFindings.map((finding, index) => (<li key={index}>• {finding}</li>))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Recommendations</h3>
                    <ul className="text-sm cyber-text-secondary space-y-1">
                      {reportData.recommendations.map((rec, index) => (<li key={index}>• {rec}</li>))}
                    </ul>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowReport(false)} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors duration-200">Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EncryptedTrafficAnalysis;

