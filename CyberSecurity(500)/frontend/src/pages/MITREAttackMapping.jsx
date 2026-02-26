import React, { useState, useEffect } from 'react';
import { createProfessionalText, createSecondaryText, createMutedText, createAccentText } from '../utils/rainbowText';

const MITREAttackMapping = () => {
  const [techniques, setTechniques] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisInput, setAnalysisInput] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);

  const mitreFunctions = [
    // MITRE ATT&CK Mapping (30 Functions)
    { id: 1, name: 'Initial Access Detection', category: 'initial', description: 'Detect initial access techniques', status: 'active' },
    { id: 2, name: 'Execution Monitoring', category: 'execution', description: 'Monitor execution techniques', status: 'active' },
    { id: 3, name: 'Persistence Detection', category: 'persistence', description: 'Detect persistence mechanisms', status: 'active' },
    { id: 4, name: 'Privilege Escalation', category: 'privilege', description: 'Monitor privilege escalation', status: 'active' },
    { id: 5, name: 'Defense Evasion', category: 'evasion', description: 'Detect defense evasion techniques', status: 'active' },
    { id: 6, name: 'Credential Access', category: 'credentials', description: 'Monitor credential access', status: 'active' },
    { id: 7, name: 'Discovery Techniques', category: 'discovery', description: 'Detect discovery techniques', status: 'active' },
    { id: 8, name: 'Lateral Movement', category: 'lateral', description: 'Monitor lateral movement', status: 'active' },
    { id: 9, name: 'Collection Monitoring', category: 'collection', description: 'Monitor data collection', status: 'active' },
    { id: 10, name: 'Command and Control', category: 'c2', description: 'Detect C2 communications', status: 'active' },
    { id: 11, name: 'Exfiltration Detection', category: 'exfiltration', description: 'Detect data exfiltration', status: 'active' },
    { id: 12, name: 'Impact Assessment', category: 'impact', description: 'Assess impact techniques', status: 'active' },
    { id: 13, name: 'Tactics Mapping', category: 'tactics', description: 'Map attack tactics', status: 'active' },
    { id: 14, name: 'Techniques Analysis', category: 'techniques', description: 'Analyze attack techniques', status: 'active' },
    { id: 15, name: 'Procedures Detection', category: 'procedures', description: 'Detect attack procedures', status: 'active' },
    { id: 16, name: 'Group Attribution', category: 'groups', description: 'Attribute attacks to groups', status: 'active' },
    { id: 17, name: 'Software Identification', category: 'software', description: 'Identify attack software', status: 'active' },
    { id: 18, name: 'Campaign Tracking', category: 'campaigns', description: 'Track attack campaigns', status: 'active' },
    { id: 19, name: 'Kill Chain Analysis', category: 'killchain', description: 'Analyze kill chain', status: 'active' },
    { id: 20, name: 'Threat Intelligence Integration', category: 'intelligence', description: 'Integrate threat intelligence', status: 'active' },
    { id: 21, name: 'Detection Rule Generation', category: 'detection', description: 'Generate detection rules', status: 'active' },
    { id: 22, name: 'Response Playbook Creation', category: 'response', description: 'Create response playbooks', status: 'active' },
    { id: 23, name: 'Risk Scoring', category: 'risk', description: 'Score attack risks', status: 'active' },
    { id: 24, name: 'Trend Analysis', category: 'trends', description: 'Analyze attack trends', status: 'active' },
    { id: 25, name: 'Compliance Mapping', category: 'compliance', description: 'Map to compliance frameworks', status: 'active' },
    { id: 26, name: 'Training Scenario Generation', category: 'training', description: 'Generate training scenarios', status: 'active' },
    { id: 27, name: 'Vulnerability Correlation', category: 'vulnerabilities', description: 'Correlate with vulnerabilities', status: 'active' },
    { id: 28, name: 'Asset Impact Analysis', category: 'assets', description: 'Analyze asset impact', status: 'active' },
    { id: 29, name: 'Timeline Reconstruction', category: 'timeline', description: 'Reconstruct attack timeline', status: 'active' },
    { id: 30, name: 'Forensic Analysis', category: 'forensics', description: 'Perform forensic analysis', status: 'active' }
  ];

  const categoryTitles = {
    initial: 'Initial Access',
    execution: 'Execution',
    persistence: 'Persistence',
    privilege: 'Privilege Escalation',
    evasion: 'Defense Evasion',
    credentials: 'Credential Access',
    discovery: 'Discovery',
    lateral: 'Lateral Movement',
    collection: 'Collection',
    c2: 'Command and Control',
    exfiltration: 'Exfiltration',
    impact: 'Impact',
    tactics: 'Tactics Mapping',
    techniques: 'Techniques Analysis',
    procedures: 'Procedures Detection',
    groups: 'Group Attribution',
    software: 'Software Identification',
    campaigns: 'Campaign Tracking',
    killchain: 'Kill Chain Analysis',
    intelligence: 'Threat Intelligence',
    detection: 'Detection Rules',
    response: 'Response Playbooks',
    risk: 'Risk Scoring',
    trends: 'Trend Analysis',
    compliance: 'Compliance Mapping',
    training: 'Training Scenarios',
    vulnerabilities: 'Vulnerability Correlation',
    assets: 'Asset Impact',
    timeline: 'Timeline Reconstruction',
    forensics: 'Forensic Analysis'
  };

  useEffect(() => {
    // Simulate loading techniques
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTechniques([
        {
          id: 'T1055',
          name: 'Process Injection',
          tactic: 'Defense Evasion',
          technique: 'T1055',
          description: 'Adversaries may inject code into processes in order to evade process-based defenses',
          severity: 'High',
          confidence: 92,
          timestamp: new Date().toISOString(),
          affectedSystems: ['Windows', 'Linux'],
          detection: 'Process monitoring, API call analysis'
        },
        {
          id: 'T1071',
          name: 'Application Layer Protocol',
          tactic: 'Command and Control',
          technique: 'T1071',
          description: 'Adversaries may communicate using application layer protocols to avoid detection',
          severity: 'Medium',
          confidence: 85,
          timestamp: new Date().toISOString(),
          affectedSystems: ['Network Infrastructure'],
          detection: 'Network traffic analysis, protocol inspection'
        },
        {
          id: 'T1083',
          name: 'File and Directory Discovery',
          tactic: 'Discovery',
          technique: 'T1083',
          description: 'Adversaries may enumerate files and directories to understand the environment',
          severity: 'Low',
          confidence: 78,
          timestamp: new Date().toISOString(),
          affectedSystems: ['Windows', 'Linux', 'macOS'],
          detection: 'File system monitoring, command line analysis'
        }
      ]);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'text-red-500';
      case 'Medium': return 'text-orange-500';
      case 'Low': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getTacticColor = (tactic) => {
    const colors = {
      'Initial Access': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Execution': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Persistence': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Privilege Escalation': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Defense Evasion': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Credential Access': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'Discovery': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Lateral Movement': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'Collection': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      'Command and Control': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Exfiltration': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Impact': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    };
    return colors[tactic] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  const handleAnalyzeTechnique = (technique) => {
    setSelectedTechnique(technique);
    setShowAnalysis(true);
  };

  const closeAnalysis = () => {
    setShowAnalysis(false);
    setSelectedTechnique(null);
    setAnalysisResults(null);
  };

  const executeMITREAnalysis = async () => {
    if (!analysisInput.trim()) return;
    
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3500));
      
      const mockResults = {
        threatLevel: Math.random() > 0.3 ? 'Critical' : Math.random() > 0.1 ? 'High' : 'Medium',
        confidence: Math.floor(Math.random() * 20) + 80,
        techniquesDetected: Math.floor(Math.random() * 15) + 5,
        tacticsIdentified: Math.floor(Math.random() * 8) + 4,
        groupsAttributed: Math.floor(Math.random() * 3) + 1,
        killChainStages: {
          reconnaissance: Math.random() > 0.5,
          weaponization: Math.random() > 0.4,
          delivery: Math.random() > 0.6,
          exploitation: Math.random() > 0.7,
          installation: Math.random() > 0.5,
          commandControl: Math.random() > 0.8,
          actionsObjectives: Math.random() > 0.3
        },
        detectedTechniques: [
          { id: 'T1055', name: 'Process Injection', tactic: 'Defense Evasion', severity: 'High' },
          { id: 'T1071', name: 'Application Layer Protocol', tactic: 'Command and Control', severity: 'Medium' },
          { id: 'T1083', name: 'File and Directory Discovery', tactic: 'Discovery', severity: 'Medium' },
          { id: 'T1105', name: 'Ingress Tool Transfer', tactic: 'Command and Control', severity: 'High' }
        ],
        threatGroups: [
          { name: 'APT29', confidence: 85, techniques: ['T1055', 'T1071'] },
          { name: 'Lazarus Group', confidence: 78, techniques: ['T1083', 'T1105'] }
        ],
        mitigations: [
          'Implement process monitoring and analysis',
          'Deploy network traffic analysis tools',
          'Enable endpoint detection and response',
          'Establish behavioral analytics'
        ],
        detectionRules: [
          'Monitor for unusual process injection patterns',
          'Analyze network traffic for C2 communications',
          'Track file system enumeration activities',
          'Detect unauthorized tool transfers'
        ]
      };
      
      setAnalysisResults(mockResults);
    } catch (error) {
      console.error('MITRE analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateReport = async () => {
    if (!selectedTechnique) return;
    
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const report = {
        id: `MITRE-${Date.now()}`,
        title: `MITRE ATT&CK Analysis Report: ${selectedTechnique.name}`,
        generated: new Date().toISOString(),
        classification: 'CONFIDENTIAL - THREAT INTELLIGENCE',
        summary: `Comprehensive MITRE ATT&CK framework analysis of ${selectedTechnique.name} reveals advanced persistent threat patterns and provides tactical countermeasures.`,
        executiveSummary: 'Advanced threat analysis using MITRE ATT&CK framework has identified sophisticated attack patterns requiring immediate defensive measures.',
        keyFindings: [
          'Multiple attack techniques identified across kill chain',
          'Advanced persistent threat group attribution confirmed',
          'Critical gaps in current detection capabilities',
          'Immediate implementation of countermeasures required',
          'Enhanced monitoring and response procedures needed'
        ],
        attackAnalysis: {
          totalTechniques: Math.floor(Math.random() * 20) + 10,
          criticalTechniques: Math.floor(Math.random() * 8) + 3,
          tacticsInvolved: Math.floor(Math.random() * 6) + 4,
          killChainCoverage: Math.floor(Math.random() * 30) + 70
        },
        threatGroups: [
          {
            name: 'APT29 (Cozy Bear)',
            confidence: 92,
            techniques: ['T1055', 'T1071', 'T1083'],
            lastSeen: '2024-01-15',
            threat: 'Critical'
          },
          {
            name: 'Lazarus Group',
            confidence: 87,
            techniques: ['T1105', 'T1027', 'T1059'],
            lastSeen: '2024-01-12',
            threat: 'High'
          }
        ],
        recommendations: [
          'Deploy advanced endpoint detection and response solutions',
          'Implement MITRE ATT&CK-based detection rules',
          'Establish threat hunting procedures',
          'Enhance security awareness training',
          'Develop incident response playbooks'
        ],
        technicalDetails: {
          analysisMethod: 'MITRE ATT&CK Framework Analysis',
          dataSource: 'Global Threat Intelligence Database',
          confidence: Math.floor(Math.random() * 15) + 85,
          riskScore: Math.floor(Math.random() * 25) + 75
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
    if (!selectedTechnique) return;
    
    try {
      const exportData = {
        technique: selectedTechnique,
        analysisResults: analysisResults,
        timestamp: new Date().toISOString(),
        format: 'JSON',
        version: '2.0',
        classification: 'CONFIDENTIAL',
        source: 'MITRE ATT&CK Mapping System'
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `mitre-attack-analysis-${selectedTechnique.id}-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert('MITRE ATT&CK analysis data exported successfully!');
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
            <p className="cyber-text-muted mt-4">Loading MITRE ATT&CK mapping...</p>
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
            MITRE ATT&CK Mapping
          </h1>
          <p className="cyber-text-secondary">
            Advanced mapping and analysis of MITRE ATT&CK framework techniques
          </p>
        </div>

        {/* Master Input */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter MITRE technique ID, tactic name, or attack pattern for analysis..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-200">
              Execute ATT&CK Analysis
            </button>
          </div>
        </div>

        {/* MITRE ATT&CK Matrix Visualization */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold cyber-text-primary mb-4 text-center">
            MITRE ATT&CK Matrix
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(categoryTitles).map(([category, title]) => (
              <div key={category} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold cyber-text-primary text-sm mb-2">{title}</h3>
                <div className="space-y-1">
                  {mitreFunctions
                    .filter(func => func.category === category)
                    .slice(0, 3)
                    .map((func) => (
                      <div key={func.id} className="text-xs cyber-text-secondary">
                        {func.name}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Function Categories */}
        {Object.entries(categoryTitles).map(([category, title]) => {
          const categoryFunctions = mitreFunctions.filter(func => func.category === category);
          
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
                    onClick={() => handleAnalyzeTechnique(func)}
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
                        Map
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Live Technique Detection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold cyber-text-primary mb-4 text-center">
            Live MITRE ATT&CK Technique Detection
          </h2>
          <div className="space-y-4">
            {techniques.map((technique) => (
              <div
                key={technique.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold cyber-text-primary">
                      {technique.name}
                    </h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-semibold">
                      {technique.technique}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(technique.severity)}`}>
                      {technique.severity}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-semibold">
                      {technique.confidence}% Confidence
                    </span>
                  </div>
                </div>
                <p className="text-sm cyber-text-secondary mb-2">
                  {technique.description}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getTacticColor(technique.tactic)}`}>
                    {technique.tactic}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs cyber-text-muted mb-2">
                  <div>
                    <span className="font-semibold">Affected Systems:</span> {technique.affectedSystems.join(', ')}
                  </div>
                  <div>
                    <span className="font-semibold">Time:</span> {new Date(technique.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xs cyber-text-muted">Detection: </span>
                  <span className="text-xs cyber-accent-blue">
                    {technique.detection}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis Modal */}
        {showAnalysis && selectedTechnique && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold cyber-text-primary">
                    {selectedTechnique.name} Analysis
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
                      {selectedTechnique.description}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Status</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      selectedTechnique.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {selectedTechnique.status}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Category</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
                      {selectedTechnique.category.toUpperCase()}
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

export default MITREAttackMapping;

