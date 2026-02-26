import React, { useState, useEffect } from 'react';
import { createProfessionalText, createSecondaryText, createMutedText, createAccentText } from '../utils/rainbowText';

const ZeroDayPrediction = () => {
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisInput, setAnalysisInput] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);

  const zeroDayFunctions = [
    // Zero-Day Exploit Prediction (15 Functions)
    { id: 1, name: 'Exploit Database Analysis', category: 'exploit', description: 'Analyze exploit databases for emerging patterns', status: 'active' },
    { id: 2, name: 'NVD CVE Correlation', category: 'exploit', description: 'Correlate NVD data with exploit patterns', status: 'active' },
    { id: 3, name: 'Memory Corruption Detection', category: 'exploit', description: 'Detect memory corruption vulnerabilities', status: 'active' },
    { id: 4, name: 'ROP Chain Analysis', category: 'exploit', description: 'Analyze Return-Oriented Programming chains', status: 'active' },
    { id: 5, name: 'Heap Spray Detection', category: 'exploit', description: 'Detect heap spraying techniques', status: 'active' },
    { id: 6, name: 'ASLR Bypass Detection', category: 'exploit', description: 'Detect ASLR bypass attempts', status: 'active' },
    { id: 7, name: 'DEP Bypass Detection', category: 'exploit', description: 'Detect DEP bypass techniques', status: 'active' },
    { id: 8, name: 'CFI Bypass Detection', category: 'exploit', description: 'Detect Control Flow Integrity bypasses', status: 'active' },
    { id: 9, name: 'Kernel Exploit Prediction', category: 'exploit', description: 'Predict kernel-level exploits', status: 'active' },
    { id: 10, name: 'Browser Exploit Analysis', category: 'exploit', description: 'Analyze browser-based exploits', status: 'active' },
    { id: 11, name: 'Mobile Exploit Detection', category: 'exploit', description: 'Detect mobile platform exploits', status: 'active' },
    { id: 12, name: 'IoT Exploit Prediction', category: 'exploit', description: 'Predict IoT device exploits', status: 'active' },
    { id: 13, name: 'Cloud Exploit Analysis', category: 'exploit', description: 'Analyze cloud platform exploits', status: 'active' },
    { id: 14, name: 'Supply Chain Exploit Detection', category: 'exploit', description: 'Detect supply chain vulnerabilities', status: 'active' },
    { id: 15, name: 'AI Model Exploit Prediction', category: 'exploit', description: 'Predict AI/ML model exploits', status: 'active' },

    // Fileless Malware Detection (12 Functions)
    { id: 16, name: 'Memory Injection Detection', category: 'fileless', description: 'Detect memory injection techniques', status: 'active' },
    { id: 17, name: 'PowerShell Analysis', category: 'fileless', description: 'Analyze PowerShell-based attacks', status: 'active' },
    { id: 18, name: 'WMI Abuse Detection', category: 'fileless', description: 'Detect WMI abuse patterns', status: 'active' },
    { id: 19, name: 'Registry Persistence', category: 'fileless', description: 'Detect registry-based persistence', status: 'active' },
    { id: 20, name: 'Process Hollowing Detection', category: 'fileless', description: 'Detect process hollowing techniques', status: 'active' },
    { id: 21, name: 'DLL Injection Analysis', category: 'fileless', description: 'Analyze DLL injection methods', status: 'active' },
    { id: 22, name: 'Reflective DLL Loading', category: 'fileless', description: 'Detect reflective DLL loading', status: 'active' },
    { id: 23, name: 'Atom Bombing Detection', category: 'fileless', description: 'Detect atom bombing techniques', status: 'active' },
    { id: 24, name: 'Process Doppelgänging', category: 'fileless', description: 'Detect process doppelgänging', status: 'active' },
    { id: 25, name: 'COM Hijacking Detection', category: 'fileless', description: 'Detect COM hijacking attacks', status: 'active' },
    { id: 26, name: 'Scheduled Task Abuse', category: 'fileless', description: 'Detect scheduled task abuse', status: 'active' },
    { id: 27, name: 'Service Installation Detection', category: 'fileless', description: 'Detect malicious service installation', status: 'active' },

    // Encrypted Traffic Analysis (10 Functions)
    { id: 28, name: 'JA3 Fingerprinting', category: 'encrypted', description: 'Generate JA3 TLS fingerprints', status: 'active' },
    { id: 29, name: 'JA3S Fingerprinting', category: 'encrypted', description: 'Generate JA3S server fingerprints', status: 'active' },
    { id: 30, name: 'TLS Version Analysis', category: 'encrypted', description: 'Analyze TLS version usage', status: 'active' },
    { id: 31, name: 'Cipher Suite Detection', category: 'encrypted', description: 'Detect cipher suite patterns', status: 'active' },
    { id: 32, name: 'Certificate Analysis', category: 'encrypted', description: 'Analyze SSL/TLS certificates', status: 'active' },
    { id: 33, name: 'SNI Analysis', category: 'encrypted', description: 'Analyze Server Name Indication', status: 'active' },
    { id: 34, name: 'ALPN Protocol Detection', category: 'encrypted', description: 'Detect ALPN protocols', status: 'active' },
    { id: 35, name: 'TLS Extension Analysis', category: 'encrypted', description: 'Analyze TLS extensions', status: 'active' },
    { id: 36, name: 'Perfect Forward Secrecy', category: 'encrypted', description: 'Check PFS implementation', status: 'active' },
    { id: 37, name: 'TLS Fingerprint Clustering', category: 'encrypted', description: 'Cluster similar TLS fingerprints', status: 'active' },

    // Insider Threat Detection (8 Functions)
    { id: 38, name: 'Behavioral Anomaly Detection', category: 'insider', description: 'Detect behavioral anomalies', status: 'active' },
    { id: 39, name: 'Privilege Escalation Monitoring', category: 'insider', description: 'Monitor privilege escalation', status: 'active' },
    { id: 40, name: 'Data Exfiltration Detection', category: 'insider', description: 'Detect data exfiltration attempts', status: 'active' },
    { id: 41, name: 'Unauthorized Access Monitoring', category: 'insider', description: 'Monitor unauthorized access', status: 'active' },
    { id: 42, name: 'HR Integration Analysis', category: 'insider', description: 'Integrate HR data for context', status: 'active' },
    { id: 43, name: 'IT Log Correlation', category: 'insider', description: 'Correlate IT system logs', status: 'active' },
    { id: 44, name: 'Risk Score Calculation', category: 'insider', description: 'Calculate insider risk scores', status: 'active' },
    { id: 45, name: 'Predictive Modeling', category: 'insider', description: 'Predict insider threats', status: 'active' }
  ];

  const categoryTitles = {
    exploit: 'Zero-Day Exploit Prediction',
    fileless: 'Fileless Malware Detection',
    encrypted: 'Encrypted Traffic Analysis',
    insider: 'Insider Threat Detection'
  };

  useEffect(() => {
    // Simulate loading predictions
    const timer = setTimeout(() => {
      setIsLoading(false);
      setPredictions([
        {
          id: 1,
          type: 'Memory Corruption',
          severity: 'Critical',
          confidence: 95,
          description: 'Potential zero-day memory corruption exploit detected',
          timestamp: new Date().toISOString(),
          affectedSystems: ['Windows 10', 'Windows 11'],
          indicators: ['Heap spray pattern', 'ROP chain signature']
        },
        {
          id: 2,
          type: 'Fileless Attack',
          severity: 'High',
          confidence: 87,
          description: 'PowerShell-based fileless malware detected',
          timestamp: new Date().toISOString(),
          affectedSystems: ['Windows Server 2019'],
          indicators: ['PowerShell obfuscation', 'WMI abuse']
        },
        {
          id: 3,
          type: 'TLS Fingerprint Anomaly',
          severity: 'Medium',
          confidence: 72,
          description: 'Unusual TLS fingerprint pattern detected',
          timestamp: new Date().toISOString(),
          affectedSystems: ['Network Infrastructure'],
          indicators: ['JA3 signature mismatch', 'Cipher suite anomaly']
        }
      ]);
    }, 2000);

    return () => clearTimeout(timer);
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

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-500';
    if (confidence >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const handleAnalyzePrediction = (prediction) => {
    setSelectedPrediction(prediction);
    setShowAnalysis(true);
  };

  const closeAnalysis = () => {
    setShowAnalysis(false);
    setSelectedPrediction(null);
    setAnalysisResults(null);
  };

  const executeZeroDayAnalysis = async () => {
    if (!analysisInput.trim()) return;
    
    setIsAnalyzing(true);
    try {
      // Simulate analysis processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResults = {
        threatLevel: Math.random() > 0.5 ? 'Critical' : Math.random() > 0.3 ? 'High' : 'Medium',
        confidence: Math.floor(Math.random() * 30) + 70,
        exploitProbability: Math.floor(Math.random() * 40) + 60,
        affectedSystems: ['Windows 10/11', 'Linux Kernel 5.x', 'macOS Monterey+'],
        vulnerabilities: [
          'CVE-2024-' + Math.floor(Math.random() * 9999).toString().padStart(4, '0'),
          'CVE-2024-' + Math.floor(Math.random() * 9999).toString().padStart(4, '0')
        ],
        attackVectors: ['Remote Code Execution', 'Privilege Escalation', 'Memory Corruption'],
        mitigations: [
          'Apply latest security patches',
          'Enable ASLR and DEP',
          'Implement network segmentation',
          'Monitor for suspicious activities'
        ],
        indicators: [
          'Unusual memory allocation patterns',
          'Suspicious network traffic',
          'Abnormal process behavior',
          'Registry modifications'
        ],
        timeline: {
          discovery: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          analysis: new Date().toISOString(),
          prediction: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      };
      
      setAnalysisResults(mockResults);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateReport = async () => {
    if (!selectedPrediction) return;
    
    setIsAnalyzing(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const report = {
        id: `RPT-${Date.now()}`,
        title: `Zero-Day Analysis Report: ${selectedPrediction.name}`,
        generated: new Date().toISOString(),
        summary: `Comprehensive analysis of ${selectedPrediction.name} reveals potential security implications and recommended countermeasures.`,
        findings: [
          'High probability of exploitation within 30 days',
          'Multiple attack vectors identified',
          'Critical systems at risk',
          'Immediate patching required'
        ],
        recommendations: [
          'Deploy emergency patches',
          'Implement monitoring rules',
          'Update security policies',
          'Conduct security awareness training'
        ],
        technicalDetails: {
          analysisMethod: 'AI/ML Pattern Recognition',
          dataSource: 'Global Threat Intelligence',
          confidence: Math.floor(Math.random() * 20) + 80,
          riskScore: Math.floor(Math.random() * 30) + 70
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
    if (!selectedPrediction) return;
    
    try {
      const exportData = {
        prediction: selectedPrediction,
        analysisResults: analysisResults,
        timestamp: new Date().toISOString(),
        format: 'JSON',
        version: '1.0'
      };
      
      // Create downloadable file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `zero-day-analysis-${selectedPrediction.id}-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Show success message
      alert('Data exported successfully!');
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
            <p className="cyber-text-muted mt-4">Loading zero-day predictions...</p>
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
            Zero-Day Prediction Engine
          </h1>
          <p className="cyber-text-secondary">
            Advanced AI/ML models for predicting and detecting zero-day exploits
          </p>
        </div>

        {/* Master Input */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={analysisInput}
              onChange={(e) => setAnalysisInput(e.target.value)}
              placeholder="Enter threat indicators, CVE IDs, or exploit patterns for analysis..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button 
              onClick={executeZeroDayAnalysis}
              disabled={isAnalyzing || !analysisInput.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors duration-200"
            >
              {isAnalyzing ? 'Analyzing...' : 'Execute Zero-Day Analysis'}
            </button>
          </div>
          
          {/* Analysis Results */}
          {analysisResults && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold cyber-text-primary mb-3">Analysis Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-sm cyber-text-muted">Threat Level</p>
                  <p className={`text-xl font-bold ${
                    analysisResults.threatLevel === 'Critical' ? 'text-red-500' :
                    analysisResults.threatLevel === 'High' ? 'text-orange-500' : 'text-yellow-500'
                  }`}>
                    {analysisResults.threatLevel}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm cyber-text-muted">Confidence</p>
                  <p className="text-xl font-bold text-blue-500">{analysisResults.confidence}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm cyber-text-muted">Exploit Probability</p>
                  <p className="text-xl font-bold text-purple-500">{analysisResults.exploitProbability}%</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold cyber-text-primary mb-2">Vulnerabilities</h4>
                  <ul className="text-sm cyber-text-secondary space-y-1">
                    {analysisResults.vulnerabilities.map((vuln, index) => (
                      <li key={index}>• {vuln}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold cyber-text-primary mb-2">Attack Vectors</h4>
                  <ul className="text-sm cyber-text-secondary space-y-1">
                    {analysisResults.attackVectors.map((vector, index) => (
                      <li key={index}>• {vector}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Function Categories */}
        {Object.entries(categoryTitles).map(([category, title]) => {
          const categoryFunctions = zeroDayFunctions.filter(func => func.category === category);
          
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
                    onClick={() => handleAnalyzePrediction(func)}
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

        {/* Live Predictions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold cyber-text-primary mb-4 text-center">
            Live Zero-Day Predictions
          </h2>
          <div className="space-y-4">
            {predictions.map((prediction) => (
              <div
                key={prediction.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold cyber-text-primary">
                    {prediction.type}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(prediction.severity)}`}>
                      {prediction.severity}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getConfidenceColor(prediction.confidence)}`}>
                      {prediction.confidence}% Confidence
                    </span>
                  </div>
                </div>
                <p className="text-sm cyber-text-secondary mb-2">
                  {prediction.description}
                </p>
                <div className="flex items-center justify-between text-xs cyber-text-muted">
                  <span>Affected: {prediction.affectedSystems.join(', ')}</span>
                  <span>{new Date(prediction.timestamp).toLocaleString()}</span>
                </div>
                <div className="mt-2">
                  <span className="text-xs cyber-text-muted">Indicators: </span>
                  <span className="text-xs cyber-accent-blue">
                    {prediction.indicators.join(', ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis Modal */}
        {showAnalysis && selectedPrediction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold cyber-text-primary">
                    {selectedPrediction.name} Analysis
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
                      {selectedPrediction.description}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Status</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      selectedPrediction.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {selectedPrediction.status}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Category</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
                      {selectedPrediction.category.toUpperCase()}
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
                  <h2 className="text-2xl font-bold cyber-text-primary">
                    {reportData.title}
                  </h2>
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
                    <h3 className="font-semibold cyber-text-primary mb-2">Report ID</h3>
                    <p className="text-sm cyber-text-secondary font-mono">{reportData.id}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Generated</h3>
                    <p className="text-sm cyber-text-secondary">
                      {new Date(reportData.generated).toLocaleString()}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Executive Summary</h3>
                    <p className="text-sm cyber-text-secondary">{reportData.summary}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold cyber-text-primary mb-2">Key Findings</h3>
                      <ul className="text-sm cyber-text-secondary space-y-1">
                        {reportData.findings.map((finding, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            {finding}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold cyber-text-primary mb-2">Recommendations</h3>
                      <ul className="text-sm cyber-text-secondary space-y-1">
                        {reportData.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Technical Details</h3>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs cyber-text-muted">Analysis Method</p>
                          <p className="text-sm cyber-text-primary font-semibold">
                            {reportData.technicalDetails.analysisMethod}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs cyber-text-muted">Data Source</p>
                          <p className="text-sm cyber-text-primary font-semibold">
                            {reportData.technicalDetails.dataSource}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs cyber-text-muted">Confidence Level</p>
                          <p className="text-sm cyber-text-primary font-semibold">
                            {reportData.technicalDetails.confidence}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs cyber-text-muted">Risk Score</p>
                          <p className="text-sm cyber-text-primary font-semibold">
                            {reportData.technicalDetails.riskScore}/100
                          </p>
                        </div>
                      </div>
                    </div>
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
                    onClick={() => {
                      const printWindow = window.open('', '_blank');
                      printWindow.document.write(`
                        <html>
                          <head><title>${reportData.title}</title></head>
                          <body>
                            <h1>${reportData.title}</h1>
                            <p><strong>Generated:</strong> ${new Date(reportData.generated).toLocaleString()}</p>
                            <h2>Summary</h2>
                            <p>${reportData.summary}</p>
                            <h2>Findings</h2>
                            <ul>${reportData.findings.map(f => `<li>${f}</li>`).join('')}</ul>
                            <h2>Recommendations</h2>
                            <ul>${reportData.recommendations.map(r => `<li>${r}</li>`).join('')}</ul>
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                      printWindow.print();
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Print Report
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

export default ZeroDayPrediction;

