import React, { useState, useEffect } from 'react';
import { createProfessionalText, createSecondaryText, createMutedText, createAccentText } from '../utils/rainbowText';

const QuantumSafeMonitoring = () => {
  const [monitoring, setMonitoring] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonitoring, setSelectedMonitoring] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisInput, setAnalysisInput] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);

  const quantumFunctions = [
    // Quantum-Safe Cryptography Monitoring (20 Functions)
    { id: 1, name: 'Post-Quantum Algorithm Detection', category: 'algorithms', description: 'Detect post-quantum cryptographic algorithms', status: 'active' },
    { id: 2, name: 'Quantum Key Distribution', category: 'algorithms', description: 'Monitor quantum key distribution systems', status: 'active' },
    { id: 3, name: 'Lattice-Based Cryptography', category: 'algorithms', description: 'Monitor lattice-based cryptographic implementations', status: 'active' },
    { id: 4, name: 'Code-Based Cryptography', category: 'algorithms', description: 'Monitor code-based cryptographic systems', status: 'active' },
    { id: 5, name: 'Multivariate Cryptography', category: 'algorithms', description: 'Monitor multivariate cryptographic schemes', status: 'active' },
    { id: 6, name: 'Hash-Based Signatures', category: 'algorithms', description: 'Monitor hash-based signature schemes', status: 'active' },
    { id: 7, name: 'Isogeny-Based Cryptography', category: 'algorithms', description: 'Monitor isogeny-based cryptographic systems', status: 'active' },
    { id: 8, name: 'TLS Certificate Analysis', category: 'certificates', description: 'Analyze TLS certificates for quantum safety', status: 'active' },
    { id: 9, name: 'SSL/TLS Protocol Monitoring', category: 'certificates', description: 'Monitor SSL/TLS protocol implementations', status: 'active' },
    { id: 10, name: 'Certificate Transparency Monitoring', category: 'certificates', description: 'Monitor certificate transparency logs', status: 'active' },
    { id: 11, name: 'Weak Cipher Detection', category: 'vulnerabilities', description: 'Detect weak cryptographic ciphers', status: 'active' },
    { id: 12, name: 'Outdated Protocol Detection', category: 'vulnerabilities', description: 'Detect outdated cryptographic protocols', status: 'active' },
    { id: 13, name: 'Key Length Analysis', category: 'vulnerabilities', description: 'Analyze cryptographic key lengths', status: 'active' },
    { id: 14, name: 'Random Number Generator Analysis', category: 'vulnerabilities', description: 'Analyze random number generators', status: 'active' },
    { id: 15, name: 'Quantum Computer Threat Assessment', category: 'threats', description: 'Assess quantum computer threats', status: 'active' },
    { id: 16, name: 'Cryptographic Migration Planning', category: 'migration', description: 'Plan cryptographic migration strategies', status: 'active' },
    { id: 17, name: 'Compliance Monitoring', category: 'compliance', description: 'Monitor quantum-safe compliance', status: 'active' },
    { id: 18, name: 'Risk Assessment', category: 'risk', description: 'Assess quantum computing risks', status: 'active' },
    { id: 19, name: 'Vulnerability Scanning', category: 'scanning', description: 'Scan for quantum vulnerabilities', status: 'active' },
    { id: 20, name: 'Security Policy Enforcement', category: 'policy', description: 'Enforce quantum-safe security policies', status: 'active' }
  ];

  const categoryTitles = {
    algorithms: 'Post-Quantum Algorithms',
    certificates: 'Certificate Analysis',
    vulnerabilities: 'Vulnerability Detection',
    threats: 'Threat Assessment',
    migration: 'Migration Planning',
    compliance: 'Compliance Monitoring',
    risk: 'Risk Assessment',
    scanning: 'Vulnerability Scanning',
    policy: 'Policy Enforcement'
  };

  useEffect(() => {
    // Simulate loading monitoring data
    const timer = setTimeout(() => {
      setIsLoading(false);
      setMonitoring([
        {
          id: 1,
          type: 'Weak TLS Certificate',
          severity: 'High',
          description: 'TLS certificate using RSA-2048 detected',
          timestamp: new Date().toISOString(),
          affectedSystems: ['Web Server', 'API Gateway'],
          quantumRisk: 'High',
          recommendation: 'Migrate to post-quantum algorithms'
        },
        {
          id: 2,
          type: 'Outdated Protocol',
          severity: 'Medium',
          description: 'TLS 1.0 protocol detected in use',
          timestamp: new Date().toISOString(),
          affectedSystems: ['Legacy System', 'Database'],
          quantumRisk: 'Medium',
          recommendation: 'Upgrade to TLS 1.3 with post-quantum support'
        },
        {
          id: 3,
          type: 'Quantum-Safe Implementation',
          severity: 'Low',
          description: 'Post-quantum cryptographic algorithm detected',
          timestamp: new Date().toISOString(),
          affectedSystems: ['New System', 'Cloud Service'],
          quantumRisk: 'Low',
          recommendation: 'Continue monitoring for updates'
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

  const getQuantumRiskColor = (risk) => {
    switch (risk) {
      case 'High': return 'text-red-500';
      case 'Medium': return 'text-orange-500';
      case 'Low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const handleAnalyzeMonitoring = (monitor) => {
    setSelectedMonitoring(monitor);
    setShowAnalysis(true);
  };

  const closeAnalysis = () => {
    setShowAnalysis(false);
    setSelectedMonitoring(null);
    setAnalysisResults(null);
  };

  const executeQuantumAnalysis = async () => {
    if (!analysisInput.trim()) return;
    
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResults = {
        quantumThreatLevel: Math.random() > 0.4 ? 'Critical' : Math.random() > 0.2 ? 'High' : 'Medium',
        confidence: Math.floor(Math.random() * 20) + 80,
        systemsAnalyzed: Math.floor(Math.random() * 100) + 50,
        vulnerableSystems: Math.floor(Math.random() * 30) + 10,
        postQuantumReady: Math.floor(Math.random() * 40) + 20,
        algorithms: {
          current: ['RSA-2048', 'ECDSA-P256', 'AES-128', 'SHA-256'],
          recommended: ['CRYSTALS-Kyber', 'CRYSTALS-Dilithium', 'FALCON', 'SPHINCS+']
        },
        certificates: {
          total: Math.floor(Math.random() * 200) + 100,
          vulnerable: Math.floor(Math.random() * 80) + 20,
          quantumSafe: Math.floor(Math.random() * 50) + 10
        },
        migrationPlan: {
          phase1: 'Certificate Authority Migration',
          phase2: 'TLS/SSL Infrastructure Update',
          phase3: 'Application Layer Security',
          timeline: '18-24 months'
        },
        recommendations: [
          'Implement hybrid post-quantum cryptography',
          'Update certificate management systems',
          'Deploy quantum-safe TLS configurations',
          'Establish cryptographic agility framework'
        ]
      };
      
      setAnalysisResults(mockResults);
    } catch (error) {
      console.error('Quantum analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateReport = async () => {
    if (!selectedMonitoring) return;
    
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const report = {
        id: `QSM-${Date.now()}`,
        title: `Quantum-Safe Cryptography Report: ${selectedMonitoring.name}`,
        generated: new Date().toISOString(),
        classification: 'CONFIDENTIAL - QUANTUM READINESS ASSESSMENT',
        summary: `Comprehensive quantum-safe analysis of ${selectedMonitoring.name} reveals critical vulnerabilities to quantum computing attacks and provides migration recommendations.`,
        executiveSummary: 'Quantum computing poses an imminent threat to current cryptographic systems. Immediate action required to implement post-quantum cryptography.',
        keyFindings: [
          'Current RSA and ECC implementations vulnerable to quantum attacks',
          'Certificate infrastructure requires immediate upgrade',
          'Legacy systems lack cryptographic agility',
          'Post-quantum algorithms available for deployment',
          'Migration timeline critical for security posture'
        ],
        quantumReadiness: {
          currentState: Math.floor(Math.random() * 40) + 20,
          targetState: 95,
          timeToQuantumThreat: '10-15 years',
          migrationUrgency: 'High'
        },
        recommendations: [
          'Deploy NIST-approved post-quantum algorithms',
          'Implement cryptographic agility framework',
          'Update certificate management infrastructure',
          'Establish quantum-safe security policies',
          'Conduct regular quantum readiness assessments'
        ],
        technicalDetails: {
          analysisMethod: 'Quantum Cryptanalysis Assessment',
          dataSource: 'NIST Post-Quantum Cryptography Standards',
          confidence: Math.floor(Math.random() * 10) + 90,
          riskScore: Math.floor(Math.random() * 20) + 80
        }
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
    if (!selectedMonitoring) return;
    
    try {
      const exportData = {
        monitoring: selectedMonitoring,
        analysisResults: analysisResults,
        timestamp: new Date().toISOString(),
        format: 'JSON',
        version: '2.0',
        classification: 'CONFIDENTIAL',
        source: 'Quantum-Safe Monitoring System'
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `quantum-safe-analysis-${selectedMonitoring.id}-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert('Quantum-safe analysis data exported successfully!');
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
            <p className="cyber-text-muted mt-4">Loading quantum-safe monitoring...</p>
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
            Quantum-Safe Cryptography Monitoring
          </h1>
          <p className="cyber-text-secondary">
            Advanced monitoring and analysis of quantum-safe cryptographic implementations
          </p>
        </div>

        {/* Master Input */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={analysisInput}
              onChange={(e) => setAnalysisInput(e.target.value)}
              placeholder="Enter certificate, protocol, or cryptographic system for quantum-safe analysis..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button 
              onClick={executeQuantumAnalysis}
              disabled={isAnalyzing || !analysisInput.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors duration-200"
            >
              {isAnalyzing ? 'Analyzing...' : 'Execute Quantum-Safe Analysis'}
            </button>
          </div>
          
          {/* Analysis Results */}
          {analysisResults && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold cyber-text-primary mb-3">Quantum-Safe Analysis Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-sm cyber-text-muted">Quantum Threat</p>
                  <p className={`text-xl font-bold ${
                    analysisResults.quantumThreatLevel === 'Critical' ? 'text-red-500' :
                    analysisResults.quantumThreatLevel === 'High' ? 'text-orange-500' : 'text-yellow-500'
                  }`}>
                    {analysisResults.quantumThreatLevel}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm cyber-text-muted">Confidence</p>
                  <p className="text-xl font-bold text-blue-500">{analysisResults.confidence}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm cyber-text-muted">Vulnerable Systems</p>
                  <p className="text-xl font-bold text-red-500">{analysisResults.vulnerableSystems}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm cyber-text-muted">Post-Quantum Ready</p>
                  <p className="text-xl font-bold text-green-500">{analysisResults.postQuantumReady}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold cyber-text-primary mb-2">Current Algorithms</h4>
                  <ul className="text-sm cyber-text-secondary space-y-1">
                    {analysisResults.algorithms.current.slice(0, 3).map((alg, index) => (
                      <li key={index}>• {alg}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold cyber-text-primary mb-2">Recommended Algorithms</h4>
                  <ul className="text-sm cyber-text-secondary space-y-1">
                    {analysisResults.algorithms.recommended.slice(0, 3).map((alg, index) => (
                      <li key={index}>• {alg}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Function Categories */}
        {Object.entries(categoryTitles).map(([category, title]) => {
          const categoryFunctions = quantumFunctions.filter(func => func.category === category);
          
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
                    onClick={() => handleAnalyzeMonitoring(func)}
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

        {/* Live Monitoring Feed */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold cyber-text-primary mb-4 text-center">
            Live Quantum-Safe Monitoring Feed
          </h2>
          <div className="space-y-4">
            {monitoring.map((monitor) => (
              <div
                key={monitor.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold cyber-text-primary">
                    {monitor.type}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(monitor.severity)}`}>
                      {monitor.severity}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getQuantumRiskColor(monitor.quantumRisk)}`}>
                      Quantum Risk: {monitor.quantumRisk}
                    </span>
                  </div>
                </div>
                <p className="text-sm cyber-text-secondary mb-2">
                  {monitor.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs cyber-text-muted mb-2">
                  <div>
                    <span className="font-semibold">Affected Systems:</span> {monitor.affectedSystems.join(', ')}
                  </div>
                  <div>
                    <span className="font-semibold">Time:</span> {new Date(monitor.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xs cyber-text-muted">Recommendation: </span>
                  <span className="text-xs cyber-accent-green">
                    {monitor.recommendation}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis Modal */}
        {showAnalysis && selectedMonitoring && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold cyber-text-primary">
                    {selectedMonitoring.name} Analysis
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
                      {selectedMonitoring.description}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Status</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      selectedMonitoring.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {selectedMonitoring.status}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Category</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
                      {selectedMonitoring.category.toUpperCase()}
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

        {/* Report Modal */}
        {showReport && reportData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold cyber-text-primary">
                      {reportData.title}
                    </h2>
                    <p className="text-sm text-red-600 font-semibold">{reportData.classification}</p>
                  </div>
                  <button
                    onClick={() => setShowReport(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Executive Summary</h3>
                    <p className="text-sm cyber-text-secondary bg-gray-50 dark:bg-gray-700 p-3 rounded">
                      {reportData.executiveSummary}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Quantum Readiness Assessment</h3>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-xs cyber-text-muted">Current State</p>
                          <p className="text-lg font-bold text-red-500">{reportData.quantumReadiness.currentState}%</p>
                        </div>
                        <div>
                          <p className="text-xs cyber-text-muted">Target State</p>
                          <p className="text-lg font-bold text-green-500">{reportData.quantumReadiness.targetState}%</p>
                        </div>
                        <div>
                          <p className="text-xs cyber-text-muted">Time to Threat</p>
                          <p className="text-lg font-bold text-orange-500">{reportData.quantumReadiness.timeToQuantumThreat}</p>
                        </div>
                        <div>
                          <p className="text-xs cyber-text-muted">Migration Urgency</p>
                          <p className="text-lg font-bold text-red-500">{reportData.quantumReadiness.migrationUrgency}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Key Findings</h3>
                    <ul className="text-sm cyber-text-secondary space-y-2">
                      {reportData.keyFindings.map((finding, index) => (
                        <li key={index} className="flex items-start bg-red-50 dark:bg-red-900/20 p-2 rounded">
                          <span className="text-red-500 mr-2 font-bold">⚠</span>
                          {finding}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Recommendations</h3>
                    <ul className="text-sm cyber-text-secondary space-y-2">
                      {reportData.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start bg-green-50 dark:bg-green-900/20 p-2 rounded">
                          <span className="text-green-500 mr-2 font-bold">✓</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={() => {
                      const reportStr = JSON.stringify(reportData, null, 2);
                      const reportBlob = new Blob([reportStr], { type: 'application/json' });
                      const url = URL.createObjectURL(reportBlob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `${reportData.id}.json`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Download Report
                  </button>
                  <button
                    onClick={() => setShowReport(false)}
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

export default QuantumSafeMonitoring;

