import React, { useState, useEffect } from 'react';
import { createProfessionalText, createSecondaryText, createMutedText, createAccentText } from '../utils/rainbowText';

const SupplyChainRisk = () => {
  const [risks, setRisks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisInput, setAnalysisInput] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);

  const supplyChainFunctions = [
    // Supply Chain Risk (35 Functions)
    { id: 1, name: 'Vendor Risk Assessment', category: 'vendors', description: 'Assess vendor security risks', status: 'active' },
    { id: 2, name: 'Third-Party Risk Management', category: 'thirdparty', description: 'Manage third-party risks', status: 'active' },
    { id: 3, name: 'Software Bill of Materials', category: 'sbom', description: 'Generate software bill of materials', status: 'active' },
    { id: 4, name: 'Dependency Analysis', category: 'dependencies', description: 'Analyze software dependencies', status: 'active' },
    { id: 5, name: 'Vulnerability Scanning', category: 'vulnerabilities', description: 'Scan for supply chain vulnerabilities', status: 'active' },
    { id: 6, name: 'License Compliance', category: 'licenses', description: 'Monitor license compliance', status: 'active' },
    { id: 7, name: 'Code Integrity Verification', category: 'integrity', description: 'Verify code integrity', status: 'active' },
    { id: 8, name: 'Package Repository Monitoring', category: 'repositories', description: 'Monitor package repositories', status: 'active' },
    { id: 9, name: 'Malicious Package Detection', category: 'malicious', description: 'Detect malicious packages', status: 'active' },
    { id: 10, name: 'Typosquatting Detection', category: 'typosquatting', description: 'Detect typosquatting attacks', status: 'active' },
    { id: 11, name: 'Dependency Confusion', category: 'confusion', description: 'Detect dependency confusion attacks', status: 'active' },
    { id: 12, name: 'Supply Chain Compromise', category: 'compromise', description: 'Detect supply chain compromises', status: 'active' },
    { id: 13, name: 'Build Process Monitoring', category: 'build', description: 'Monitor build processes', status: 'active' },
    { id: 14, name: 'CI/CD Pipeline Security', category: 'cicd', description: 'Secure CI/CD pipelines', status: 'active' },
    { id: 15, name: 'Artifact Verification', category: 'artifacts', description: 'Verify build artifacts', status: 'active' },
    { id: 16, name: 'Container Image Scanning', category: 'containers', description: 'Scan container images', status: 'active' },
    { id: 17, name: 'Base Image Analysis', category: 'baseimages', description: 'Analyze base images', status: 'active' },
    { id: 18, name: 'Runtime Security', category: 'runtime', description: 'Monitor runtime security', status: 'active' },
    { id: 19, name: 'Network Security', category: 'network', description: 'Monitor network security', status: 'active' },
    { id: 20, name: 'Access Control', category: 'access', description: 'Monitor access controls', status: 'active' },
    { id: 21, name: 'Authentication Monitoring', category: 'auth', description: 'Monitor authentication', status: 'active' },
    { id: 22, name: 'Authorization Analysis', category: 'authorization', description: 'Analyze authorization', status: 'active' },
    { id: 23, name: 'Data Protection', category: 'data', description: 'Protect sensitive data', status: 'active' },
    { id: 24, name: 'Encryption Monitoring', category: 'encryption', description: 'Monitor encryption usage', status: 'active' },
    { id: 25, name: 'Key Management', category: 'keys', description: 'Manage cryptographic keys', status: 'active' },
    { id: 26, name: 'Certificate Management', category: 'certificates', description: 'Manage certificates', status: 'active' },
    { id: 27, name: 'Compliance Monitoring', category: 'compliance', description: 'Monitor compliance', status: 'active' },
    { id: 28, name: 'Risk Scoring', category: 'scoring', description: 'Calculate risk scores', status: 'active' },
    { id: 29, name: 'Threat Intelligence', category: 'intelligence', description: 'Supply chain threat intelligence', status: 'active' },
    { id: 30, name: 'Incident Response', category: 'incidents', description: 'Respond to supply chain incidents', status: 'active' },
    { id: 31, name: 'Forensic Analysis', category: 'forensics', description: 'Supply chain forensics', status: 'active' },
    { id: 32, name: 'Asset Management', category: 'assets', description: 'Manage supply chain assets', status: 'active' },
    { id: 33, name: 'Performance Monitoring', category: 'performance', description: 'Monitor performance', status: 'active' },
    { id: 34, name: 'Cost Analysis', category: 'cost', description: 'Analyze supply chain costs', status: 'active' },
    { id: 35, name: 'Quality Assurance', category: 'quality', description: 'Ensure supply chain quality', status: 'active' }
  ];

  const categoryTitles = {
    vendors: 'Vendor Risk',
    thirdparty: 'Third-Party Risk',
    sbom: 'Software Bill of Materials',
    dependencies: 'Dependency Analysis',
    vulnerabilities: 'Vulnerability Scanning',
    licenses: 'License Compliance',
    integrity: 'Code Integrity',
    repositories: 'Repository Monitoring',
    malicious: 'Malicious Package Detection',
    typosquatting: 'Typosquatting Detection',
    confusion: 'Dependency Confusion',
    compromise: 'Supply Chain Compromise',
    build: 'Build Process',
    cicd: 'CI/CD Security',
    artifacts: 'Artifact Verification',
    containers: 'Container Security',
    baseimages: 'Base Image Analysis',
    runtime: 'Runtime Security',
    network: 'Network Security',
    access: 'Access Control',
    auth: 'Authentication',
    authorization: 'Authorization',
    data: 'Data Protection',
    encryption: 'Encryption',
    keys: 'Key Management',
    certificates: 'Certificate Management',
    compliance: 'Compliance',
    scoring: 'Risk Scoring',
    intelligence: 'Threat Intelligence',
    incidents: 'Incident Response',
    forensics: 'Forensics',
    assets: 'Asset Management',
    performance: 'Performance',
    cost: 'Cost Analysis',
    quality: 'Quality Assurance'
  };

  useEffect(() => {
    // Simulate loading risks
    const timer = setTimeout(() => {
      setIsLoading(false);
      setRisks([
        {
          id: 1,
          type: 'Malicious Package',
          severity: 'High',
          confidence: 95,
          timestamp: new Date().toISOString(),
          description: 'Malicious package detected in npm repository',
          packageName: 'express-validator',
          version: '1.0.0',
          source: 'npm',
          indicators: ['Suspicious code patterns', 'Unusual network activity', 'Data exfiltration'],
          riskScore: 88,
          affectedSystems: ['Web Application', 'Node.js Runtime'],
          detection: 'Package analysis, behavioral monitoring'
        },
        {
          id: 2,
          type: 'Dependency Confusion',
          severity: 'Medium',
          confidence: 82,
          timestamp: new Date().toISOString(),
          description: 'Dependency confusion attack detected',
          packageName: 'internal-utils',
          version: '2.1.0',
          source: 'PyPI',
          indicators: ['Package name collision', 'Unauthorized source', 'Version mismatch'],
          riskScore: 75,
          affectedSystems: ['Python Application', 'Build System'],
          detection: 'Dependency analysis, source verification'
        },
        {
          id: 3,
          type: 'Vendor Risk',
          severity: 'Low',
          confidence: 78,
          timestamp: new Date().toISOString(),
          description: 'High-risk vendor identified in supply chain',
          packageName: 'vendor-library',
          version: '3.2.1',
          source: 'Third-party vendor',
          indicators: ['Security vulnerabilities', 'Poor security practices', 'Limited support'],
          riskScore: 65,
          affectedSystems: ['Enterprise Application', 'Vendor Integration'],
          detection: 'Vendor assessment, vulnerability scanning'
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

  const getSourceColor = (source) => {
    switch (source) {
      case 'npm': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'PyPI': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Maven': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'NuGet': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Third-party vendor': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const handleAnalyzeRisk = (risk) => {
    setSelectedRisk(risk);
    setShowAnalysis(true);
  };

  const closeAnalysis = () => {
    setShowAnalysis(false);
    setSelectedRisk(null);
    setAnalysisResults(null);
  };

  const executeSupplyChainAnalysis = async () => {
    if (!analysisInput.trim()) return;
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      const mockResults = {
        riskLevel: Math.random() > 0.5 ? 'High' : 'Critical',
        confidence: Math.floor(Math.random() * 15) + 85,
        vendorsAssessed: Math.floor(Math.random() * 25) + 10,
        vulnerabilities: Math.floor(Math.random() * 20) + 5,
        complianceScore: Math.floor(Math.random() * 30) + 70,
        sbomComponents: Math.floor(Math.random() * 100) + 50,
        recommendations: ['Implement vendor security assessments', 'Update dependency management', 'Enhance SBOM tracking']
      };
      setAnalysisResults(mockResults);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateReport = async () => {
    if (!selectedRisk) return;
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const report = {
        id: `SCR-${Date.now()}`,
        title: `Supply Chain Risk Report: ${selectedRisk.vendor}`,
        generated: new Date().toISOString(),
        classification: 'CONFIDENTIAL - SUPPLY CHAIN SECURITY',
        summary: `Comprehensive supply chain risk assessment reveals vendor security posture and dependency vulnerabilities.`,
        keyFindings: ['Vendor security gaps identified', 'Dependency vulnerabilities found', 'SBOM compliance issues detected'],
        recommendations: ['Implement vendor security standards', 'Update dependency management', 'Enhance supply chain monitoring'],
        technicalDetails: { analysisMethod: 'Supply Chain Risk Assessment', confidence: 89, riskScore: 82 }
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
    if (!selectedRisk) return;
    try {
      const exportData = { risk: selectedRisk, analysisResults, timestamp: new Date().toISOString(), format: 'JSON', source: 'Supply Chain Risk System' };
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `supply-chain-risk-${selectedRisk.id}-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      alert('Supply chain risk data exported successfully!');
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
            <p className="cyber-text-muted mt-4">Loading supply chain risk analysis...</p>
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
            Supply Chain Risk
          </h1>
          <p className="cyber-text-secondary">
            Advanced supply chain security monitoring and risk assessment
          </p>
        </div>

        {/* Master Input */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={analysisInput}
              onChange={(e) => setAnalysisInput(e.target.value)}
              placeholder="Enter package name, vendor, or dependency for supply chain risk analysis..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button 
              onClick={executeSupplyChainAnalysis}
              disabled={isAnalyzing || !analysisInput.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors duration-200"
            >
              {isAnalyzing ? 'Analyzing...' : 'Execute Risk Analysis'}
            </button>
          </div>
        </div>

        {/* Function Categories */}
        {Object.entries(categoryTitles).map(([category, title]) => {
          const categoryFunctions = supplyChainFunctions.filter(func => func.category === category);
          
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
                    onClick={() => handleAnalyzeRisk(func)}
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
                        Assess
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Live Supply Chain Risk Detection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold cyber-text-primary mb-4 text-center">
            Live Supply Chain Risk Detection
          </h2>
          <div className="space-y-4">
            {risks.map((risk) => (
              <div
                key={risk.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold cyber-text-primary">
                      {risk.type}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSourceColor(risk.source)}`}>
                      {risk.source}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(risk.severity)}`}>
                      {risk.severity}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-semibold">
                      {risk.confidence}% Confidence
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full text-xs font-semibold">
                      Risk: {risk.riskScore}
                    </span>
                  </div>
                </div>
                <p className="text-sm cyber-text-secondary mb-2">
                  {risk.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs cyber-text-muted mb-2">
                  <div>
                    <span className="font-semibold">Package:</span> {risk.packageName} v{risk.version}
                  </div>
                  <div>
                    <span className="font-semibold">Affected Systems:</span> {risk.affectedSystems.join(', ')}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs cyber-text-muted mb-2">
                  <div>
                    <span className="font-semibold">Source:</span> {risk.source}
                  </div>
                  <div>
                    <span className="font-semibold">Time:</span> {new Date(risk.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="mb-2">
                  <span className="text-xs cyber-text-muted">Indicators: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {risk.indicators.map((indicator, index) => (
                      <span key={index} className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded text-xs">
                        {indicator}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xs cyber-text-muted">Detection: </span>
                  <span className="text-xs cyber-accent-blue">
                    {risk.detection}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis Modal */}
        {showAnalysis && selectedRisk && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold cyber-text-primary">
                    {selectedRisk.name} Analysis
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
                      {selectedRisk.description}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Status</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      selectedRisk.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {selectedRisk.status}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Category</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
                      {selectedRisk.category.toUpperCase()}
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

export default SupplyChainRisk;

