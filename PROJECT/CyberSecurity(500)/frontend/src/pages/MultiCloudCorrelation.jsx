import React, { useState, useEffect } from 'react';
import { createProfessionalText, createSecondaryText, createMutedText, createAccentText } from '../utils/rainbowText';

const MultiCloudCorrelation = () => {
  const [correlations, setCorrelations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCorrelation, setSelectedCorrelation] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisInput, setAnalysisInput] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);

  const cloudFunctions = [
    // Multi-Cloud Correlation (35 Functions)
    { id: 1, name: 'AWS Security Hub Integration', category: 'aws', description: 'Integrate with AWS Security Hub', status: 'active' },
    { id: 2, name: 'Azure Security Center Integration', category: 'azure', description: 'Integrate with Azure Security Center', status: 'active' },
    { id: 3, name: 'GCP Security Command Center', category: 'gcp', description: 'Integrate with GCP Security Command Center', status: 'active' },
    { id: 4, name: 'Cross-Cloud Threat Correlation', category: 'correlation', description: 'Correlate threats across multiple clouds', status: 'active' },
    { id: 5, name: 'Multi-Cloud Asset Discovery', category: 'assets', description: 'Discover assets across multiple clouds', status: 'active' },
    { id: 6, name: 'Cloud Configuration Analysis', category: 'config', description: 'Analyze cloud configurations', status: 'active' },
    { id: 7, name: 'Identity and Access Management', category: 'iam', description: 'Monitor IAM across clouds', status: 'active' },
    { id: 8, name: 'Network Security Analysis', category: 'network', description: 'Analyze network security across clouds', status: 'active' },
    { id: 9, name: 'Data Security Monitoring', category: 'data', description: 'Monitor data security across clouds', status: 'active' },
    { id: 10, name: 'Compliance Monitoring', category: 'compliance', description: 'Monitor compliance across clouds', status: 'active' },
    { id: 11, name: 'Vulnerability Management', category: 'vulnerabilities', description: 'Manage vulnerabilities across clouds', status: 'active' },
    { id: 12, name: 'Incident Response', category: 'incidents', description: 'Coordinate incident response across clouds', status: 'active' },
    { id: 13, name: 'Threat Intelligence Sharing', category: 'intelligence', description: 'Share threat intelligence across clouds', status: 'active' },
    { id: 14, name: 'Security Orchestration', category: 'orchestration', description: 'Orchestrate security across clouds', status: 'active' },
    { id: 15, name: 'Automated Response', category: 'response', description: 'Automated response across clouds', status: 'active' },
    { id: 16, name: 'Cost Optimization', category: 'cost', description: 'Optimize security costs across clouds', status: 'active' },
    { id: 17, name: 'Performance Monitoring', category: 'performance', description: 'Monitor performance across clouds', status: 'active' },
    { id: 18, name: 'Log Aggregation', category: 'logs', description: 'Aggregate logs from multiple clouds', status: 'active' },
    { id: 19, name: 'Metrics Collection', category: 'metrics', description: 'Collect metrics from multiple clouds', status: 'active' },
    { id: 20, name: 'Alert Management', category: 'alerts', description: 'Manage alerts across clouds', status: 'active' },
    { id: 21, name: 'Dashboard Integration', category: 'dashboard', description: 'Integrate dashboards across clouds', status: 'active' },
    { id: 22, name: 'Reporting and Analytics', category: 'reporting', description: 'Generate reports across clouds', status: 'active' },
    { id: 23, name: 'API Integration', category: 'api', description: 'Integrate APIs across clouds', status: 'active' },
    { id: 24, name: 'Data Lake Integration', category: 'datalake', description: 'Integrate data lakes across clouds', status: 'active' },
    { id: 25, name: 'Machine Learning Models', category: 'ml', description: 'Deploy ML models across clouds', status: 'active' },
    { id: 26, name: 'Container Security', category: 'containers', description: 'Monitor container security across clouds', status: 'active' },
    { id: 27, name: 'Serverless Security', category: 'serverless', description: 'Monitor serverless security across clouds', status: 'active' },
    { id: 28, name: 'Database Security', category: 'database', description: 'Monitor database security across clouds', status: 'active' },
    { id: 29, name: 'Storage Security', category: 'storage', description: 'Monitor storage security across clouds', status: 'active' },
    { id: 30, name: 'Compute Security', category: 'compute', description: 'Monitor compute security across clouds', status: 'active' },
    { id: 31, name: 'Network Security Groups', category: 'nsg', description: 'Monitor NSGs across clouds', status: 'active' },
    { id: 32, name: 'Firewall Rules', category: 'firewall', description: 'Monitor firewall rules across clouds', status: 'active' },
    { id: 33, name: 'Load Balancer Security', category: 'loadbalancer', description: 'Monitor load balancer security', status: 'active' },
    { id: 34, name: 'CDN Security', category: 'cdn', description: 'Monitor CDN security across clouds', status: 'active' },
    { id: 35, name: 'DNS Security', category: 'dns', description: 'Monitor DNS security across clouds', status: 'active' }
  ];

  const categoryTitles = {
    aws: 'AWS Integration',
    azure: 'Azure Integration',
    gcp: 'GCP Integration',
    correlation: 'Threat Correlation',
    assets: 'Asset Discovery',
    config: 'Configuration Analysis',
    iam: 'Identity & Access',
    network: 'Network Security',
    data: 'Data Security',
    compliance: 'Compliance',
    vulnerabilities: 'Vulnerability Management',
    incidents: 'Incident Response',
    intelligence: 'Threat Intelligence',
    orchestration: 'Security Orchestration',
    response: 'Automated Response',
    cost: 'Cost Optimization',
    performance: 'Performance Monitoring',
    logs: 'Log Aggregation',
    metrics: 'Metrics Collection',
    alerts: 'Alert Management',
    dashboard: 'Dashboard Integration',
    reporting: 'Reporting & Analytics',
    api: 'API Integration',
    datalake: 'Data Lake Integration',
    ml: 'Machine Learning',
    containers: 'Container Security',
    serverless: 'Serverless Security',
    database: 'Database Security',
    storage: 'Storage Security',
    compute: 'Compute Security',
    nsg: 'Network Security Groups',
    firewall: 'Firewall Rules',
    loadbalancer: 'Load Balancer',
    cdn: 'CDN Security',
    dns: 'DNS Security'
  };

  useEffect(() => {
    // Simulate loading correlations
    const timer = setTimeout(() => {
      setIsLoading(false);
      setCorrelations([
        {
          id: 1,
          type: 'Cross-Cloud Attack',
          severity: 'High',
          confidence: 92,
          timestamp: new Date().toISOString(),
          description: 'Coordinated attack detected across AWS, Azure, and GCP environments',
          affectedClouds: ['AWS', 'Azure', 'GCP'],
          indicators: ['Suspicious API calls', 'Unusual network traffic', 'Privilege escalation'],
          riskScore: 88,
          affectedResources: ['EC2 instances', 'Virtual Machines', 'Compute Engine'],
          detection: 'Multi-cloud correlation, threat intelligence'
        },
        {
          id: 2,
          type: 'Data Exfiltration',
          severity: 'Medium',
          confidence: 85,
          timestamp: new Date().toISOString(),
          description: 'Data exfiltration attempt detected across multiple cloud storage services',
          affectedClouds: ['AWS', 'Azure'],
          indicators: ['Large data transfers', 'Unusual access patterns', 'Off-hours activity'],
          riskScore: 72,
          affectedResources: ['S3 buckets', 'Blob Storage'],
          detection: 'Storage monitoring, access pattern analysis'
        },
        {
          id: 3,
          type: 'Configuration Drift',
          severity: 'Low',
          confidence: 78,
          timestamp: new Date().toISOString(),
          description: 'Configuration drift detected across cloud environments',
          affectedClouds: ['AWS', 'GCP'],
          indicators: ['Policy changes', 'Resource modifications', 'Access rule updates'],
          riskScore: 65,
          affectedResources: ['IAM policies', 'Security groups', 'Firewall rules'],
          detection: 'Configuration monitoring, compliance checking'
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

  const getCloudColor = (cloud) => {
    switch (cloud) {
      case 'AWS': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'Azure': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'GCP': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const handleAnalyzeCorrelation = (correlation) => {
    setSelectedCorrelation(correlation);
    setShowAnalysis(true);
  };

  const closeAnalysis = () => {
    setShowAnalysis(false);
    setSelectedCorrelation(null);
    setAnalysisResults(null);
  };

  const executeCloudAnalysis = async () => {
    if (!analysisInput.trim()) return;
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      const mockResults = {
        threatLevel: Math.random() > 0.6 ? 'High' : 'Medium',
        confidence: Math.floor(Math.random() * 15) + 85,
        cloudsAnalyzed: ['AWS', 'Azure', 'GCP'],
        correlationsFound: Math.floor(Math.random() * 20) + 5,
        securityFindings: Math.floor(Math.random() * 15) + 8,
        complianceIssues: Math.floor(Math.random() * 10) + 2,
        recommendations: ['Standardize security policies', 'Implement cross-cloud monitoring', 'Enhance IAM controls']
      };
      setAnalysisResults(mockResults);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateReport = async () => {
    if (!selectedCorrelation) return;
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const report = {
        id: `MCC-${Date.now()}`,
        title: `Multi-Cloud Correlation Report: ${selectedCorrelation.clouds.join(', ')}`,
        generated: new Date().toISOString(),
        classification: 'CONFIDENTIAL - CLOUD SECURITY',
        summary: `Cross-cloud security analysis reveals correlations and potential security gaps across multiple cloud environments.`,
        keyFindings: ['Cross-cloud threats identified', 'Security policy gaps found', 'Compliance issues detected'],
        recommendations: ['Implement unified security policies', 'Deploy cross-cloud monitoring', 'Enhance compliance controls'],
        technicalDetails: { analysisMethod: 'Cross-Cloud Correlation', confidence: 87, riskScore: 72 }
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
    if (!selectedCorrelation) return;
    try {
      const exportData = { correlation: selectedCorrelation, analysisResults, timestamp: new Date().toISOString(), format: 'JSON', source: 'Multi-Cloud Correlation System' };
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `multi-cloud-analysis-${selectedCorrelation.id}-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      alert('Multi-cloud analysis data exported successfully!');
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
            <p className="cyber-text-muted mt-4">Loading multi-cloud correlation...</p>
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
            Multi-Cloud Correlation
          </h1>
          <p className="cyber-text-secondary">
            Advanced threat correlation and security monitoring across multiple cloud environments
          </p>
        </div>

        {/* Master Input */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={analysisInput}
              onChange={(e) => setAnalysisInput(e.target.value)}
              placeholder="Enter cloud provider, resource, or threat indicator for multi-cloud analysis..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button 
              onClick={executeCloudAnalysis}
              disabled={isAnalyzing || !analysisInput.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors duration-200"
            >
              {isAnalyzing ? 'Analyzing...' : 'Execute Multi-Cloud Analysis'}
            </button>
          </div>
          {analysisResults && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold cyber-text-primary mb-3">Multi-Cloud Analysis Results</h3>
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
                  <p className="text-sm cyber-text-muted">Correlations</p>
                  <p className="text-xl font-bold text-green-500">{analysisResults.correlationsFound}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm cyber-text-muted">Findings</p>
                  <p className="text-xl font-bold text-purple-500">{analysisResults.securityFindings}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Function Categories */}
        {Object.entries(categoryTitles).map(([category, title]) => {
          const categoryFunctions = cloudFunctions.filter(func => func.category === category);
          
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
                    onClick={() => handleAnalyzeCorrelation(func)}
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
                        Correlate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Live Multi-Cloud Correlation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold cyber-text-primary mb-4 text-center">
            Live Multi-Cloud Correlation
          </h2>
          <div className="space-y-4">
            {correlations.map((correlation) => (
              <div
                key={correlation.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold cyber-text-primary">
                      {correlation.type}
                    </h3>
                    <div className="flex gap-1">
                      {correlation.affectedClouds.map((cloud, index) => (
                        <span key={index} className={`px-2 py-1 rounded-full text-xs font-semibold ${getCloudColor(cloud)}`}>
                          {cloud}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(correlation.severity)}`}>
                      {correlation.severity}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-semibold">
                      {correlation.confidence}% Confidence
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full text-xs font-semibold">
                      Risk: {correlation.riskScore}
                    </span>
                  </div>
                </div>
                <p className="text-sm cyber-text-secondary mb-2">
                  {correlation.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs cyber-text-muted mb-2">
                  <div>
                    <span className="font-semibold">Affected Resources:</span> {correlation.affectedResources.join(', ')}
                  </div>
                  <div>
                    <span className="font-semibold">Time:</span> {new Date(correlation.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="mb-2">
                  <span className="text-xs cyber-text-muted">Indicators: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {correlation.indicators.map((indicator, index) => (
                      <span key={index} className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded text-xs">
                        {indicator}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xs cyber-text-muted">Detection: </span>
                  <span className="text-xs cyber-accent-blue">
                    {correlation.detection}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis Modal */}
        {showAnalysis && selectedCorrelation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold cyber-text-primary">
                    {selectedCorrelation.name} Analysis
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
                      {selectedCorrelation.description}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Status</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      selectedCorrelation.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {selectedCorrelation.status}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Category</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
                      {selectedCorrelation.category.toUpperCase()}
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

export default MultiCloudCorrelation;

