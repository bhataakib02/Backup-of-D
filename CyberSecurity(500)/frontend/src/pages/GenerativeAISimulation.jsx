import React, { useState, useEffect } from 'react';
import { createProfessionalText, createSecondaryText, createMutedText, createAccentText } from '../utils/rainbowText';

const GenerativeAISimulation = () => {
  const [simulations, setSimulations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSimulation, setSelectedSimulation] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisInput, setAnalysisInput] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);

  const genAIFunctions = [
    // Generative AI Simulation (35 Functions)
    { id: 1, name: 'Attack Scenario Generation', category: 'scenarios', description: 'Generate realistic attack scenarios', status: 'active' },
    { id: 2, name: 'Malware Variant Creation', category: 'malware', description: 'Create malware variants for testing', status: 'active' },
    { id: 3, name: 'Phishing Email Generation', category: 'phishing', description: 'Generate phishing emails for training', status: 'active' },
    { id: 4, name: 'Network Traffic Simulation', category: 'traffic', description: 'Simulate network traffic patterns', status: 'active' },
    { id: 5, name: 'User Behavior Simulation', category: 'behavior', description: 'Simulate user behavior patterns', status: 'active' },
    { id: 6, name: 'Threat Actor Personas', category: 'personas', description: 'Generate threat actor personas', status: 'active' },
    { id: 7, name: 'Attack Chain Generation', category: 'chains', description: 'Generate attack kill chains', status: 'active' },
    { id: 8, name: 'Vulnerability Exploitation', category: 'exploits', description: 'Generate exploit scenarios', status: 'active' },
    { id: 9, name: 'Social Engineering Campaigns', category: 'social', description: 'Generate social engineering campaigns', status: 'active' },
    { id: 10, name: 'Insider Threat Scenarios', category: 'insider', description: 'Generate insider threat scenarios', status: 'active' },
    { id: 11, name: 'Supply Chain Attacks', category: 'supply', description: 'Generate supply chain attack scenarios', status: 'active' },
    { id: 12, name: 'Ransomware Campaigns', category: 'ransomware', description: 'Generate ransomware attack scenarios', status: 'active' },
    { id: 13, name: 'APT Campaign Simulation', category: 'apt', description: 'Simulate APT campaigns', status: 'active' },
    { id: 14, name: 'Botnet Simulation', category: 'botnet', description: 'Simulate botnet activities', status: 'active' },
    { id: 15, name: 'DDoS Attack Simulation', category: 'ddos', description: 'Simulate DDoS attacks', status: 'active' },
    { id: 16, name: 'Data Exfiltration Scenarios', category: 'exfiltration', description: 'Generate data exfiltration scenarios', status: 'active' },
    { id: 17, name: 'Cryptocurrency Crime Simulation', category: 'crypto', description: 'Simulate cryptocurrency crimes', status: 'active' },
    { id: 18, name: 'Dark Web Activity Simulation', category: 'darkweb', description: 'Simulate dark web activities', status: 'active' },
    { id: 19, name: 'IoT Attack Simulation', category: 'iot', description: 'Simulate IoT attacks', status: 'active' },
    { id: 20, name: 'Cloud Security Scenarios', category: 'cloud', description: 'Generate cloud security scenarios', status: 'active' },
    { id: 21, name: 'Mobile Security Simulation', category: 'mobile', description: 'Simulate mobile security threats', status: 'active' },
    { id: 22, name: 'Web Application Attacks', category: 'webapp', description: 'Generate web application attacks', status: 'active' },
    { id: 23, name: 'Database Security Scenarios', category: 'database', description: 'Generate database security scenarios', status: 'active' },
    { id: 24, name: 'API Security Testing', category: 'api', description: 'Generate API security test scenarios', status: 'active' },
    { id: 25, name: 'Container Security Simulation', category: 'containers', description: 'Simulate container security threats', status: 'active' },
    { id: 26, name: 'Serverless Security Scenarios', category: 'serverless', description: 'Generate serverless security scenarios', status: 'active' },
    { id: 27, name: 'Blockchain Security Simulation', category: 'blockchain', description: 'Simulate blockchain security threats', status: 'active' },
    { id: 28, name: 'AI/ML Security Scenarios', category: 'aiml', description: 'Generate AI/ML security scenarios', status: 'active' },
    { id: 29, name: 'Quantum Security Simulation', category: 'quantum', description: 'Simulate quantum security threats', status: 'active' },
    { id: 30, name: '5G Security Scenarios', category: '5g', description: 'Generate 5G security scenarios', status: 'active' },
    { id: 31, name: 'Edge Computing Security', category: 'edge', description: 'Generate edge computing security scenarios', status: 'active' },
    { id: 32, name: 'Zero Trust Simulation', category: 'zerotrust', description: 'Simulate zero trust security scenarios', status: 'active' },
    { id: 33, name: 'Compliance Testing Scenarios', category: 'compliance', description: 'Generate compliance testing scenarios', status: 'active' },
    { id: 34, name: 'Incident Response Simulation', category: 'incident', description: 'Simulate incident response scenarios', status: 'active' },
    { id: 35, name: 'Forensic Analysis Scenarios', category: 'forensics', description: 'Generate forensic analysis scenarios', status: 'active' }
  ];

  const categoryTitles = {
    scenarios: 'Attack Scenarios',
    malware: 'Malware Generation',
    phishing: 'Phishing Simulation',
    traffic: 'Network Traffic',
    behavior: 'User Behavior',
    personas: 'Threat Personas',
    chains: 'Attack Chains',
    exploits: 'Exploit Generation',
    social: 'Social Engineering',
    insider: 'Insider Threats',
    supply: 'Supply Chain',
    ransomware: 'Ransomware',
    apt: 'APT Campaigns',
    botnet: 'Botnet Simulation',
    ddos: 'DDoS Attacks',
    exfiltration: 'Data Exfiltration',
    crypto: 'Cryptocurrency',
    darkweb: 'Dark Web',
    iot: 'IoT Security',
    cloud: 'Cloud Security',
    mobile: 'Mobile Security',
    webapp: 'Web Applications',
    database: 'Database Security',
    api: 'API Security',
    containers: 'Container Security',
    serverless: 'Serverless Security',
    blockchain: 'Blockchain Security',
    aiml: 'AI/ML Security',
    quantum: 'Quantum Security',
    '5g': '5G Security',
    edge: 'Edge Computing',
    zerotrust: 'Zero Trust',
    compliance: 'Compliance',
    incident: 'Incident Response',
    forensics: 'Forensics'
  };

  useEffect(() => {
    // Simulate loading simulations
    const timer = setTimeout(() => {
      setIsLoading(false);
      setSimulations([
        {
          id: 1,
          name: 'Advanced Persistent Threat Campaign',
          type: 'APT Simulation',
          complexity: 'High',
          duration: '30 days',
          lastRun: new Date().toISOString(),
          description: 'Simulated APT campaign targeting financial institutions',
          techniques: ['Spear Phishing', 'Lateral Movement', 'Data Exfiltration', 'Persistence'],
          targets: ['Banking Systems', 'Customer Data', 'Financial Records'],
          detection: 'Generative AI, attack simulation'
        },
        {
          id: 2,
          name: 'Ransomware Attack Simulation',
          type: 'Ransomware Campaign',
          complexity: 'Medium',
          duration: '7 days',
          lastRun: new Date().toISOString(),
          description: 'Simulated ransomware attack on healthcare systems',
          techniques: ['Initial Access', 'Privilege Escalation', 'Encryption', 'Ransom Demand'],
          targets: ['Patient Records', 'Medical Systems', 'Backup Systems'],
          detection: 'AI-generated scenarios, behavioral analysis'
        },
        {
          id: 3,
          name: 'Insider Threat Simulation',
          type: 'Insider Attack',
          complexity: 'Low',
          duration: '14 days',
          lastRun: new Date().toISOString(),
          description: 'Simulated insider threat attempting data theft',
          techniques: ['Unauthorized Access', 'Data Collection', 'Exfiltration', 'Cover-up'],
          targets: ['Intellectual Property', 'Customer Data', 'Financial Information'],
          detection: 'User behavior simulation, anomaly detection'
        }
      ]);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case 'High': return 'text-red-500';
      case 'Medium': return 'text-orange-500';
      case 'Low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      'APT Simulation': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Ransomware Campaign': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Insider Attack': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Phishing Campaign': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'DDoS Attack': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  const handleAnalyzeSimulation = (simulation) => {
    setSelectedSimulation(simulation);
    setShowAnalysis(true);
  };

  const closeAnalysis = () => {
    setShowAnalysis(false);
    setSelectedSimulation(null);
    setAnalysisResults(null);
  };

  const executeGenAIAnalysis = async () => {
    if (!analysisInput.trim()) return;
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      const mockResults = {
        simulationQuality: Math.random() > 0.7 ? 'Excellent' : 'High',
        confidence: Math.floor(Math.random() * 10) + 90,
        scenariosGenerated: Math.floor(Math.random() * 100) + 50,
        realismScore: Math.floor(Math.random() * 15) + 85,
        attackVariants: Math.floor(Math.random() * 25) + 10,
        trainingEffectiveness: Math.floor(Math.random() * 20) + 80,
        recommendations: ['Enhance scenario diversity', 'Improve realism parameters', 'Deploy advanced simulation models']
      };
      setAnalysisResults(mockResults);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateReport = async () => {
    if (!selectedSimulation) return;
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const report = {
        id: `GAI-${Date.now()}`,
        title: `Generative AI Simulation Report: ${selectedSimulation.scenario}`,
        generated: new Date().toISOString(),
        classification: 'CONFIDENTIAL - AI SIMULATION',
        summary: `Advanced generative AI simulation creates realistic attack scenarios for comprehensive security training and testing.`,
        keyFindings: ['High-quality attack scenarios generated', 'Realistic threat simulations created', 'Training effectiveness improved'],
        recommendations: ['Expand scenario library', 'Enhance AI model capabilities', 'Integrate with security training programs'],
        technicalDetails: { analysisMethod: 'Generative AI Analysis', confidence: 93, qualityScore: 91 }
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
    if (!selectedSimulation) return;
    try {
      const exportData = { simulation: selectedSimulation, analysisResults, timestamp: new Date().toISOString(), format: 'JSON', source: 'Generative AI Simulation System' };
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `generative-ai-simulation-${selectedSimulation.id}-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      alert('Generative AI simulation data exported successfully!');
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
            <p className="cyber-text-muted mt-4">Loading generative AI simulations...</p>
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
            Generative AI Simulation
          </h1>
          <p className="cyber-text-secondary">
            AI-powered attack simulation and scenario generation for security testing
          </p>
        </div>

        {/* Master Input */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter attack type, scenario, or threat for AI simulation..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-200">
              Execute AI Simulation
            </button>
          </div>
        </div>

        {/* Function Categories */}
        {Object.entries(categoryTitles).map(([category, title]) => {
          const categoryFunctions = genAIFunctions.filter(func => func.category === category);
          
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
                    onClick={() => handleAnalyzeSimulation(func)}
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
                        Generate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Live AI Simulation Results */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold cyber-text-primary mb-4 text-center">
            Live AI Simulation Results
          </h2>
          <div className="space-y-4">
            {simulations.map((simulation) => (
              <div
                key={simulation.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold cyber-text-primary">
                      {simulation.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(simulation.type)}`}>
                      {simulation.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getComplexityColor(simulation.complexity)}`}>
                      {simulation.complexity} Complexity
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-semibold">
                      {simulation.duration}
                    </span>
                  </div>
                </div>
                <p className="text-sm cyber-text-secondary mb-2">
                  {simulation.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs cyber-text-muted mb-2">
                  <div>
                    <span className="font-semibold">Type:</span> {simulation.type}
                  </div>
                  <div>
                    <span className="font-semibold">Last Run:</span> {new Date(simulation.lastRun).toLocaleString()}
                  </div>
                </div>
                <div className="mb-2">
                  <span className="text-xs cyber-text-muted">Techniques: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {simulation.techniques.map((technique, index) => (
                      <span key={index} className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded text-xs">
                        {technique}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mb-2">
                  <span className="text-xs cyber-text-muted">Targets: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {simulation.targets.map((target, index) => (
                      <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded text-xs">
                        {target}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xs cyber-text-muted">Detection: </span>
                  <span className="text-xs cyber-accent-blue">
                    {simulation.detection}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis Modal */}
        {showAnalysis && selectedSimulation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold cyber-text-primary">
                    {selectedSimulation.name} Analysis
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
                      {selectedSimulation.description}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Status</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      selectedSimulation.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {selectedSimulation.status}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Category</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
                      {selectedSimulation.category.toUpperCase()}
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

export default GenerativeAISimulation;

