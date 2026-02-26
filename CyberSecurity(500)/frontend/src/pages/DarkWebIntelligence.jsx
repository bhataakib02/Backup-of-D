import React, { useState, useEffect } from 'react';
import { createProfessionalText, createSecondaryText, createMutedText, createAccentText } from '../utils/rainbowText';

const DarkWebIntelligence = () => {
  const [intelligence, setIntelligence] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIntelligence, setSelectedIntelligence] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisInput, setAnalysisInput] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);

  const darkWebFunctions = [
    // Dark Web Intelligence (20 Functions)
    { id: 1, name: 'Forum Monitoring', category: 'monitoring', description: 'Monitor dark web forums for threats', status: 'active' },
    { id: 2, name: 'Marketplace Analysis', category: 'monitoring', description: 'Analyze dark web marketplaces', status: 'active' },
    { id: 3, name: 'Leak Detection', category: 'monitoring', description: 'Detect data leaks on dark web', status: 'active' },
    { id: 4, name: 'Ransomware Group Tracking', category: 'monitoring', description: 'Track ransomware group activities', status: 'active' },
    { id: 5, name: 'Credential Monitoring', category: 'monitoring', description: 'Monitor stolen credentials', status: 'active' },
    { id: 6, name: 'Threat Actor Profiling', category: 'analysis', description: 'Profile threat actors and groups', status: 'active' },
    { id: 7, name: 'Communication Analysis', category: 'analysis', description: 'Analyze threat communications', status: 'active' },
    { id: 8, name: 'Infrastructure Mapping', category: 'analysis', description: 'Map threat infrastructure', status: 'active' },
    { id: 9, name: 'TTP Analysis', category: 'analysis', description: 'Analyze tactics, techniques, procedures', status: 'active' },
    { id: 10, name: 'Campaign Tracking', category: 'analysis', description: 'Track threat campaigns', status: 'active' },
    { id: 11, name: 'Cryptocurrency Tracking', category: 'crypto', description: 'Track cryptocurrency transactions', status: 'active' },
    { id: 12, name: 'Wallet Analysis', category: 'crypto', description: 'Analyze cryptocurrency wallets', status: 'active' },
    { id: 13, name: 'Blockchain Forensics', category: 'crypto', description: 'Perform blockchain forensics', status: 'active' },
    { id: 14, name: 'Mixing Service Detection', category: 'crypto', description: 'Detect cryptocurrency mixing services', status: 'active' },
    { id: 15, name: 'Exchange Monitoring', category: 'crypto', description: 'Monitor cryptocurrency exchanges', status: 'active' },
    { id: 16, name: 'Social Media OSINT', category: 'osint', description: 'Gather OSINT from social media', status: 'active' },
    { id: 17, name: 'Paste Site Monitoring', category: 'osint', description: 'Monitor paste sites for leaks', status: 'active' },
    { id: 18, name: 'GitHub Leak Detection', category: 'osint', description: 'Detect leaks on GitHub', status: 'active' },
    { id: 19, name: 'Domain Intelligence', category: 'osint', description: 'Gather domain intelligence', status: 'active' },
    { id: 20, name: 'Email Intelligence', category: 'osint', description: 'Gather email intelligence', status: 'active' }
  ];

  const categoryTitles = {
    monitoring: 'Dark Web Monitoring',
    analysis: 'Threat Analysis',
    crypto: 'Cryptocurrency Intelligence',
    osint: 'OSINT Collection'
  };

  useEffect(() => {
    // Simulate loading intelligence
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIntelligence([
        {
          id: 1,
          type: 'Data Leak',
          severity: 'Critical',
          source: 'Dark Web Forum',
          description: 'Corporate database leak detected on underground forum',
          timestamp: new Date().toISOString(),
          affectedData: ['Customer PII', 'Financial Records'],
          threatActor: 'Unknown',
          confidence: 92
        },
        {
          id: 2,
          type: 'Ransomware Campaign',
          severity: 'High',
          source: 'Marketplace',
          description: 'New ransomware campaign targeting healthcare sector',
          timestamp: new Date().toISOString(),
          affectedData: ['Patient Records', 'Medical Systems'],
          threatActor: 'LockBit 3.0',
          confidence: 88
        },
        {
          id: 3,
          type: 'Credential Sale',
          severity: 'Medium',
          source: 'Credential Market',
          description: 'Stolen credentials for sale on dark web market',
          timestamp: new Date().toISOString(),
          affectedData: ['Employee Accounts', 'Admin Access'],
          threatActor: 'Credential Seller',
          confidence: 75
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

  const handleAnalyzeIntelligence = (intel) => {
    setSelectedIntelligence(intel);
    setShowAnalysis(true);
  };

  const closeAnalysis = () => {
    setShowAnalysis(false);
    setSelectedIntelligence(null);
    setAnalysisResults(null);
  };

  const executeDarkWebAnalysis = async () => {
    if (!analysisInput.trim()) return;
    
    setIsAnalyzing(true);
    try {
      // Simulate dark web analysis processing
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      const mockResults = {
        threatLevel: Math.random() > 0.4 ? 'Critical' : Math.random() > 0.2 ? 'High' : 'Medium',
        confidence: Math.floor(Math.random() * 25) + 75,
        darkWebSources: Math.floor(Math.random() * 15) + 5,
        threatsFound: Math.floor(Math.random() * 8) + 2,
        marketplaces: ['AlphaBay 2.0', 'DarkMarket', 'White House Market', 'Monopoly Market'],
        forums: ['RaidForums', 'BreachForums', 'XSS Forum', 'Nulled'],
        threatActors: [
          'REvil/Sodinokibi',
          'LockBit 3.0',
          'BlackCat/ALPHV',
          'Conti Group'
        ],
        dataTypes: [
          'Stolen Credentials',
          'Credit Card Data',
          'Corporate Databases',
          'Personal Information',
          'Medical Records'
        ],
        cryptocurrencyActivity: {
          bitcoinTransactions: Math.floor(Math.random() * 500) + 100,
          moneroTransactions: Math.floor(Math.random() * 200) + 50,
          totalValue: Math.floor(Math.random() * 1000000) + 100000
        },
        geolocation: ['Russia', 'China', 'North Korea', 'Iran', 'Eastern Europe'],
        indicators: [
          'Suspicious Tor traffic patterns',
          'Cryptocurrency mixing services',
          'Encrypted communication channels',
          'Anonymous file sharing',
          'VPN exit node activities'
        ],
        recommendations: [
          'Implement dark web monitoring alerts',
          'Enhance employee security training',
          'Deploy advanced threat detection',
          'Strengthen access controls',
          'Monitor cryptocurrency transactions'
        ],
        timeline: {
          firstSeen: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          lastActivity: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
          analysis: new Date().toISOString()
        }
      };
      
      setAnalysisResults(mockResults);
    } catch (error) {
      console.error('Dark web analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateReport = async () => {
    if (!selectedIntelligence) return;
    
    setIsAnalyzing(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const report = {
        id: `DWI-${Date.now()}`,
        title: `Dark Web Intelligence Report: ${selectedIntelligence.name}`,
        generated: new Date().toISOString(),
        classification: 'CONFIDENTIAL',
        summary: `Comprehensive dark web analysis of ${selectedIntelligence.name} reveals significant threat intelligence and criminal activities requiring immediate attention.`,
        executiveSummary: 'Dark web monitoring has identified critical threats to organizational security including data breaches, credential theft, and targeted attacks.',
        keyFindings: [
          'Active threat actor discussions targeting your organization',
          'Stolen credentials available for purchase',
          'Corporate data leaked on underground forums',
          'Ransomware groups planning targeted campaigns',
          'Cryptocurrency transactions linked to criminal activities'
        ],
        threatActorProfiles: [
          {
            name: 'REvil/Sodinokibi',
            activity: 'Ransomware operations',
            threat: 'Critical',
            lastSeen: '2024-01-15'
          },
          {
            name: 'LockBit 3.0',
            activity: 'Data exfiltration',
            threat: 'High',
            lastSeen: '2024-01-12'
          }
        ],
        recommendations: [
          'Implement continuous dark web monitoring',
          'Deploy advanced threat detection systems',
          'Conduct security awareness training',
          'Strengthen access control mechanisms',
          'Establish incident response procedures'
        ],
        technicalDetails: {
          analysisMethod: 'AI-Powered Dark Web Crawling',
          dataSource: 'Global Dark Web Intelligence Network',
          confidence: Math.floor(Math.random() * 15) + 85,
          riskScore: Math.floor(Math.random() * 25) + 75,
          sourcesAnalyzed: Math.floor(Math.random() * 50) + 25
        },
        iocs: [
          'tor://3g2upl4pq6kufc4m.onion',
          'bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
          'email:threat@darkweb.onion'
        ]
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
    if (!selectedIntelligence) return;
    
    try {
      const exportData = {
        intelligence: selectedIntelligence,
        analysisResults: analysisResults,
        timestamp: new Date().toISOString(),
        format: 'JSON',
        version: '2.0',
        classification: 'CONFIDENTIAL',
        source: 'Dark Web Intelligence System'
      };
      
      // Create downloadable file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `dark-web-intelligence-${selectedIntelligence.id}-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Show success message
      alert('Dark web intelligence data exported successfully!');
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
            <p className="cyber-text-muted mt-4">Loading dark web intelligence...</p>
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
            Dark Web Intelligence
          </h1>
          <p className="cyber-text-secondary">
            Advanced monitoring and analysis of dark web threats and activities
          </p>
        </div>

        {/* Master Input */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={analysisInput}
              onChange={(e) => setAnalysisInput(e.target.value)}
              placeholder="Enter threat indicators, actor names, or keywords for dark web analysis..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button 
              onClick={executeDarkWebAnalysis}
              disabled={isAnalyzing || !analysisInput.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors duration-200"
            >
              {isAnalyzing ? 'Analyzing...' : 'Execute Dark Web Analysis'}
            </button>
          </div>
          
          {/* Analysis Results */}
          {analysisResults && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold cyber-text-primary mb-3">Dark Web Analysis Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
                  <p className="text-sm cyber-text-muted">Sources</p>
                  <p className="text-xl font-bold text-purple-500">{analysisResults.darkWebSources}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm cyber-text-muted">Threats Found</p>
                  <p className="text-xl font-bold text-red-500">{analysisResults.threatsFound}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold cyber-text-primary mb-2">Active Marketplaces</h4>
                  <ul className="text-sm cyber-text-secondary space-y-1">
                    {analysisResults.marketplaces.slice(0, 3).map((marketplace, index) => (
                      <li key={index}>• {marketplace}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold cyber-text-primary mb-2">Threat Actors</h4>
                  <ul className="text-sm cyber-text-secondary space-y-1">
                    {analysisResults.threatActors.slice(0, 3).map((actor, index) => (
                      <li key={index}>• {actor}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-semibold cyber-text-primary mb-2">Cryptocurrency Activity</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="cyber-text-muted">Bitcoin Transactions</p>
                    <p className="font-bold text-orange-500">{analysisResults.cryptocurrencyActivity.bitcoinTransactions}</p>
                  </div>
                  <div>
                    <p className="cyber-text-muted">Monero Transactions</p>
                    <p className="font-bold text-gray-500">{analysisResults.cryptocurrencyActivity.moneroTransactions}</p>
                  </div>
                  <div>
                    <p className="cyber-text-muted">Total Value</p>
                    <p className="font-bold text-green-500">${analysisResults.cryptocurrencyActivity.totalValue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Function Categories */}
        {Object.entries(categoryTitles).map(([category, title]) => {
          const categoryFunctions = darkWebFunctions.filter(func => func.category === category);
          
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
                    onClick={() => handleAnalyzeIntelligence(func)}
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

        {/* Live Intelligence Feed */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold cyber-text-primary mb-4 text-center">
            Live Dark Web Intelligence Feed
          </h2>
          <div className="space-y-4">
            {intelligence.map((intel) => (
              <div
                key={intel.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold cyber-text-primary">
                    {intel.type}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(intel.severity)}`}>
                      {intel.severity}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getConfidenceColor(intel.confidence)}`}>
                      {intel.confidence}% Confidence
                    </span>
                  </div>
                </div>
                <p className="text-sm cyber-text-secondary mb-2">
                  {intel.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs cyber-text-muted">
                  <div>
                    <span className="font-semibold">Source:</span> {intel.source}
                  </div>
                  <div>
                    <span className="font-semibold">Actor:</span> {intel.threatActor}
                  </div>
                  <div>
                    <span className="font-semibold">Time:</span> {new Date(intel.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xs cyber-text-muted">Affected Data: </span>
                  <span className="text-xs cyber-accent-red">
                    {intel.affectedData.join(', ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis Modal */}
        {showAnalysis && selectedIntelligence && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold cyber-text-primary">
                    {selectedIntelligence.name} Analysis
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
                      {selectedIntelligence.description}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Status</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      selectedIntelligence.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {selectedIntelligence.status}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Category</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
                      {selectedIntelligence.category.toUpperCase()}
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Executive Summary</h3>
                    <p className="text-sm cyber-text-secondary bg-gray-50 dark:bg-gray-700 p-3 rounded">
                      {reportData.executiveSummary}
                    </p>
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
                    <h3 className="font-semibold cyber-text-primary mb-2">Threat Actor Profiles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {reportData.threatActorProfiles.map((actor, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold cyber-text-primary text-sm">{actor.name}</h4>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              actor.threat === 'Critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                              'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                            }`}>
                              {actor.threat}
                            </span>
                          </div>
                          <p className="text-xs cyber-text-secondary">{actor.activity}</p>
                          <p className="text-xs cyber-text-muted">Last seen: {actor.lastSeen}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Indicators of Compromise (IOCs)</h3>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                      <ul className="text-sm cyber-text-secondary space-y-1 font-mono">
                        {reportData.iocs.map((ioc, index) => (
                          <li key={index} className="break-all">• {ioc}</li>
                        ))}
                      </ul>
                    </div>
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
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Technical Analysis Details</h3>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                          <p className="text-xs cyber-text-muted">Sources Analyzed</p>
                          <p className="text-sm cyber-text-primary font-semibold">
                            {reportData.technicalDetails.sourcesAnalyzed}
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
                          <head>
                            <title>${reportData.title}</title>
                            <style>
                              body { font-family: Arial, sans-serif; margin: 20px; }
                              .classification { color: red; font-weight: bold; }
                              .finding { background: #ffebee; padding: 8px; margin: 4px 0; border-left: 4px solid #f44336; }
                              .recommendation { background: #e8f5e8; padding: 8px; margin: 4px 0; border-left: 4px solid #4caf50; }
                              .ioc { font-family: monospace; background: #f5f5f5; padding: 2px 4px; }
                            </style>
                          </head>
                          <body>
                            <h1>${reportData.title}</h1>
                            <p class="classification">${reportData.classification}</p>
                            <p><strong>Generated:</strong> ${new Date(reportData.generated).toLocaleString()}</p>
                            <h2>Executive Summary</h2>
                            <p>${reportData.executiveSummary}</p>
                            <h2>Key Findings</h2>
                            ${reportData.keyFindings.map(f => `<div class="finding">⚠ ${f}</div>`).join('')}
                            <h2>Threat Actor Profiles</h2>
                            ${reportData.threatActorProfiles.map(a => `<div><strong>${a.name}</strong> (${a.threat}): ${a.activity}</div>`).join('')}
                            <h2>IOCs</h2>
                            ${reportData.iocs.map(i => `<div class="ioc">${i}</div>`).join('')}
                            <h2>Recommendations</h2>
                            ${reportData.recommendations.map(r => `<div class="recommendation">✓ ${r}</div>`).join('')}
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

export default DarkWebIntelligence;

