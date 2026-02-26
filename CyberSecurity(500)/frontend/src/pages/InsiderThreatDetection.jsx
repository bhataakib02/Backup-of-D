import React, { useState, useEffect } from 'react';
import { createProfessionalText, createSecondaryText, createMutedText, createAccentText } from '../utils/rainbowText';

const InsiderThreatDetection = () => {
  const [threats, setThreats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisInput, setAnalysisInput] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);

  const insiderFunctions = [
    // Insider Threat Detection (30 Functions)
    { id: 1, name: 'User Behavior Analytics', category: 'behavior', description: 'Analyze user behavior patterns', status: 'active' },
    { id: 2, name: 'Access Pattern Analysis', category: 'access', description: 'Analyze access patterns and anomalies', status: 'active' },
    { id: 3, name: 'Data Exfiltration Detection', category: 'exfiltration', description: 'Detect data exfiltration attempts', status: 'active' },
    { id: 4, name: 'Privilege Escalation Monitoring', category: 'privilege', description: 'Monitor privilege escalation attempts', status: 'active' },
    { id: 5, name: 'File Access Anomaly Detection', category: 'files', description: 'Detect anomalous file access patterns', status: 'active' },
    { id: 6, name: 'Network Activity Monitoring', category: 'network', description: 'Monitor network activity for insider threats', status: 'active' },
    { id: 7, name: 'Email Communication Analysis', category: 'email', description: 'Analyze email communications for threats', status: 'active' },
    { id: 8, name: 'Application Usage Monitoring', category: 'applications', description: 'Monitor application usage patterns', status: 'active' },
    { id: 9, name: 'Time-based Anomaly Detection', category: 'time', description: 'Detect time-based anomalies', status: 'active' },
    { id: 10, name: 'Geographic Anomaly Detection', category: 'geographic', description: 'Detect geographic anomalies', status: 'active' },
    { id: 11, name: 'Device Usage Analysis', category: 'devices', description: 'Analyze device usage patterns', status: 'active' },
    { id: 12, name: 'Login Pattern Analysis', category: 'login', description: 'Analyze login patterns and anomalies', status: 'active' },
    { id: 13, name: 'Session Duration Analysis', category: 'sessions', description: 'Analyze session duration patterns', status: 'active' },
    { id: 14, name: 'Command Line Monitoring', category: 'commands', description: 'Monitor command line activities', status: 'active' },
    { id: 15, name: 'Process Execution Analysis', category: 'processes', description: 'Analyze process execution patterns', status: 'active' },
    { id: 16, name: 'Registry Access Monitoring', category: 'registry', description: 'Monitor registry access patterns', status: 'active' },
    { id: 17, name: 'Service Account Monitoring', category: 'services', description: 'Monitor service account activities', status: 'active' },
    { id: 18, name: 'Database Access Analysis', category: 'database', description: 'Analyze database access patterns', status: 'active' },
    { id: 19, name: 'Cloud Resource Monitoring', category: 'cloud', description: 'Monitor cloud resource usage', status: 'active' },
    { id: 20, name: 'API Usage Analysis', category: 'api', description: 'Analyze API usage patterns', status: 'active' },
    { id: 21, name: 'Social Engineering Detection', category: 'social', description: 'Detect social engineering attempts', status: 'active' },
    { id: 22, name: 'Phishing Attempt Detection', category: 'phishing', description: 'Detect phishing attempts by insiders', status: 'active' },
    { id: 23, name: 'Malware Installation Detection', category: 'malware', description: 'Detect malware installation attempts', status: 'active' },
    { id: 24, name: 'Unauthorized Software Detection', category: 'software', description: 'Detect unauthorized software installation', status: 'active' },
    { id: 25, name: 'System Configuration Changes', category: 'config', description: 'Monitor system configuration changes', status: 'active' },
    { id: 26, name: 'Security Policy Violations', category: 'policy', description: 'Detect security policy violations', status: 'active' },
    { id: 27, name: 'Compliance Monitoring', category: 'compliance', description: 'Monitor compliance violations', status: 'active' },
    { id: 28, name: 'Risk Scoring', category: 'risk', description: 'Calculate insider threat risk scores', status: 'active' },
    { id: 29, name: 'Threat Intelligence Integration', category: 'intelligence', description: 'Integrate threat intelligence for insider threats', status: 'active' },
    { id: 30, name: 'Automated Response', category: 'response', description: 'Automated response to insider threats', status: 'active' }
  ];

  const categoryTitles = {
    behavior: 'Behavioral Analysis',
    access: 'Access Pattern Analysis',
    exfiltration: 'Data Exfiltration',
    privilege: 'Privilege Escalation',
    files: 'File Access Monitoring',
    network: 'Network Activity',
    email: 'Email Analysis',
    applications: 'Application Monitoring',
    time: 'Time-based Analysis',
    geographic: 'Geographic Analysis',
    devices: 'Device Analysis',
    login: 'Login Analysis',
    sessions: 'Session Analysis',
    commands: 'Command Monitoring',
    processes: 'Process Analysis',
    registry: 'Registry Monitoring',
    services: 'Service Monitoring',
    database: 'Database Analysis',
    cloud: 'Cloud Monitoring',
    api: 'API Analysis',
    social: 'Social Engineering',
    phishing: 'Phishing Detection',
    malware: 'Malware Detection',
    software: 'Software Monitoring',
    config: 'Configuration Changes',
    policy: 'Policy Violations',
    compliance: 'Compliance Monitoring',
    risk: 'Risk Scoring',
    intelligence: 'Threat Intelligence',
    response: 'Automated Response'
  };

  useEffect(() => {
    // Simulate loading threats
    const timer = setTimeout(() => {
      setIsLoading(false);
      setThreats([
        {
          id: 1,
          user: 'john.doe@company.com',
          type: 'Data Exfiltration',
          severity: 'High',
          confidence: 94,
          timestamp: new Date().toISOString(),
          description: 'Large volume of sensitive data accessed and copied to external storage',
          indicators: ['Unusual file access patterns', 'Large data transfers', 'Off-hours access'],
          riskScore: 85,
          affectedSystems: ['File Server', 'Database'],
          detection: 'Behavioral analysis, file access monitoring'
        },
        {
          id: 2,
          user: 'jane.smith@company.com',
          type: 'Privilege Escalation',
          severity: 'Medium',
          confidence: 87,
          timestamp: new Date().toISOString(),
          description: 'Attempts to escalate privileges and access restricted systems',
          indicators: ['Failed privilege escalation', 'Unusual system access', 'Command line anomalies'],
          riskScore: 72,
          affectedSystems: ['Active Directory', 'Domain Controller'],
          detection: 'Access pattern analysis, command monitoring'
        },
        {
          id: 3,
          user: 'bob.wilson@company.com',
          type: 'Unauthorized Software',
          severity: 'Low',
          confidence: 76,
          timestamp: new Date().toISOString(),
          description: 'Installation of unauthorized software on company device',
          indicators: ['New software installation', 'Registry changes', 'Process execution'],
          riskScore: 58,
          affectedSystems: ['Workstation', 'Registry'],
          detection: 'Software monitoring, registry analysis'
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

  const getRiskColor = (riskScore) => {
    if (riskScore >= 80) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    if (riskScore >= 60) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    if (riskScore >= 40) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  };

  const handleAnalyzeThreat = (threat) => {
    setSelectedThreat(threat);
    setShowAnalysis(true);
  };

  const closeAnalysis = () => {
    setShowAnalysis(false);
    setSelectedThreat(null);
    setAnalysisResults(null);
  };

  const executeInsiderAnalysis = async () => {
    if (!analysisInput.trim()) return;
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      const mockResults = {
        riskLevel: Math.random() > 0.4 ? 'High' : 'Critical',
        confidence: Math.floor(Math.random() * 15) + 85,
        behaviorAnomalies: Math.floor(Math.random() * 12) + 3,
        accessPatterns: ['Unusual file access', 'Off-hours activity', 'Geographic anomalies'],
        riskScore: Math.floor(Math.random() * 30) + 70,
        indicators: ['Data exfiltration attempts', 'Privilege escalation', 'Suspicious communications'],
        recommendations: ['Implement user monitoring', 'Restrict access privileges', 'Enable behavioral analytics']
      };
      setAnalysisResults(mockResults);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateReport = async () => {
    if (!selectedThreat) return;
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const report = {
        id: `ITD-${Date.now()}`,
        title: `Insider Threat Analysis Report: ${selectedThreat.user}`,
        generated: new Date().toISOString(),
        classification: 'CONFIDENTIAL - INSIDER THREAT',
        summary: `Behavioral analysis reveals potential insider threat activities and risk indicators.`,
        keyFindings: ['Behavioral anomalies detected', 'Access pattern deviations', 'Risk indicators identified'],
        recommendations: ['Enhanced monitoring required', 'Access review recommended', 'Security training needed'],
        technicalDetails: { analysisMethod: 'Behavioral Analytics', confidence: 92, riskScore: 88 }
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
    if (!selectedThreat) return;
    try {
      const exportData = { threat: selectedThreat, analysisResults, timestamp: new Date().toISOString(), format: 'JSON', source: 'Insider Threat Detection System' };
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `insider-threat-analysis-${selectedThreat.id}-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      alert('Insider threat analysis data exported successfully!');
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
            <p className="cyber-text-muted mt-4">Loading insider threat detection...</p>
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
            Insider Threat Detection
          </h1>
          <p className="cyber-text-secondary">
            AI-powered detection of insider threats and malicious user behavior
          </p>
        </div>

        {/* Master Input */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={analysisInput}
              onChange={(e) => setAnalysisInput(e.target.value)}
              placeholder="Enter username, email, or behavior pattern for insider threat analysis..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button 
              onClick={executeInsiderAnalysis}
              disabled={isAnalyzing || !analysisInput.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors duration-200"
            >
              {isAnalyzing ? 'Analyzing...' : 'Execute Insider Analysis'}
            </button>
          </div>
          {analysisResults && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold cyber-text-primary mb-3">Insider Threat Analysis Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-sm cyber-text-muted">Risk Level</p>
                  <p className="text-xl font-bold text-red-500">{analysisResults.riskLevel}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm cyber-text-muted">Confidence</p>
                  <p className="text-xl font-bold text-blue-500">{analysisResults.confidence}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm cyber-text-muted">Anomalies</p>
                  <p className="text-xl font-bold text-orange-500">{analysisResults.behaviorAnomalies}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm cyber-text-muted">Risk Score</p>
                  <p className="text-xl font-bold text-purple-500">{analysisResults.riskScore}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Function Categories */}
        {Object.entries(categoryTitles).map(([category, title]) => {
          const categoryFunctions = insiderFunctions.filter(func => func.category === category);
          
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
                    onClick={() => handleAnalyzeThreat(func)}
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

        {/* Live Insider Threat Detection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold cyber-text-primary mb-4 text-center">
            Live Insider Threat Detection
          </h2>
          <div className="space-y-4">
            {threats.map((threat) => (
              <div
                key={threat.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold cyber-text-primary">
                      {threat.user}
                    </h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-semibold">
                      {threat.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(threat.severity)}`}>
                      {threat.severity}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-semibold">
                      {threat.confidence}% Confidence
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRiskColor(threat.riskScore)}`}>
                      Risk: {threat.riskScore}
                    </span>
                  </div>
                </div>
                <p className="text-sm cyber-text-secondary mb-2">
                  {threat.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs cyber-text-muted mb-2">
                  <div>
                    <span className="font-semibold">Affected Systems:</span> {threat.affectedSystems.join(', ')}
                  </div>
                  <div>
                    <span className="font-semibold">Time:</span> {new Date(threat.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="mb-2">
                  <span className="text-xs cyber-text-muted">Indicators: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {threat.indicators.map((indicator, index) => (
                      <span key={index} className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded text-xs">
                        {indicator}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xs cyber-text-muted">Detection: </span>
                  <span className="text-xs cyber-accent-blue">
                    {threat.detection}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis Modal */}
        {showAnalysis && selectedThreat && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold cyber-text-primary">
                    {selectedThreat.name} Analysis
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
                      {selectedThreat.description}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Status</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      selectedThreat.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {selectedThreat.status}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Category</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
                      {selectedThreat.category.toUpperCase()}
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

export default InsiderThreatDetection;

