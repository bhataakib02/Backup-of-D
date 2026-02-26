import React, { useState, useEffect } from 'react';
import { createProfessionalText, createSecondaryText, createMutedText, createAccentText } from '../utils/rainbowText';

const ReinforcementLearning = () => {
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisInput, setAnalysisInput] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);

  const rlFunctions = [
    // Reinforcement Learning (30 Functions)
    { id: 1, name: 'Q-Learning Algorithm', category: 'qlearning', description: 'Q-learning for automated response', status: 'active' },
    { id: 2, name: 'Deep Q-Network', category: 'dqn', description: 'Deep Q-Network for complex decisions', status: 'active' },
    { id: 3, name: 'Policy Gradient', category: 'policy', description: 'Policy gradient methods', status: 'active' },
    { id: 4, name: 'Actor-Critic', category: 'actorcritic', description: 'Actor-critic algorithms', status: 'active' },
    { id: 5, name: 'Proximal Policy Optimization', category: 'ppo', description: 'PPO for stable learning', status: 'active' },
    { id: 6, name: 'Trust Region Policy Optimization', category: 'trpo', description: 'TRPO for policy optimization', status: 'active' },
    { id: 7, name: 'Soft Actor-Critic', category: 'sac', description: 'SAC for continuous control', status: 'active' },
    { id: 8, name: 'Twin Delayed DDPG', category: 'td3', description: 'TD3 for continuous actions', status: 'active' },
    { id: 9, name: 'Multi-Agent RL', category: 'multiagent', description: 'Multi-agent reinforcement learning', status: 'active' },
    { id: 10, name: 'Hierarchical RL', category: 'hierarchical', description: 'Hierarchical reinforcement learning', status: 'active' },
    { id: 11, name: 'Meta-Learning', category: 'meta', description: 'Meta-learning for fast adaptation', status: 'active' },
    { id: 12, name: 'Transfer Learning', category: 'transfer', description: 'Transfer learning across domains', status: 'active' },
    { id: 13, name: 'Imitation Learning', category: 'imitation', description: 'Learning from expert demonstrations', status: 'active' },
    { id: 14, name: 'Inverse RL', category: 'inverse', description: 'Inverse reinforcement learning', status: 'active' },
    { id: 15, name: 'Adversarial RL', category: 'adversarial', description: 'Adversarial reinforcement learning', status: 'active' },
    { id: 16, name: 'Safe RL', category: 'safe', description: 'Safe reinforcement learning', status: 'active' },
    { id: 17, name: 'Robust RL', category: 'robust', description: 'Robust reinforcement learning', status: 'active' },
    { id: 18, name: 'Online Learning', category: 'online', description: 'Online reinforcement learning', status: 'active' },
    { id: 19, name: 'Offline RL', category: 'offline', description: 'Offline reinforcement learning', status: 'active' },
    { id: 20, name: 'Model-Based RL', category: 'modelbased', description: 'Model-based reinforcement learning', status: 'active' },
    { id: 21, name: 'Model-Free RL', category: 'modelfree', description: 'Model-free reinforcement learning', status: 'active' },
    { id: 22, name: 'Value Function Approximation', category: 'value', description: 'Value function approximation', status: 'active' },
    { id: 23, name: 'Policy Approximation', category: 'policyapprox', description: 'Policy function approximation', status: 'active' },
    { id: 24, name: 'Experience Replay', category: 'replay', description: 'Experience replay buffer', status: 'active' },
    { id: 25, name: 'Prioritized Experience Replay', category: 'prioritized', description: 'Prioritized experience replay', status: 'active' },
    { id: 26, name: 'Exploration Strategies', category: 'exploration', description: 'Exploration strategies', status: 'active' },
    { id: 27, name: 'Reward Shaping', category: 'reward', description: 'Reward shaping techniques', status: 'active' },
    { id: 28, name: 'Curriculum Learning', category: 'curriculum', description: 'Curriculum learning', status: 'active' },
    { id: 29, name: 'Hyperparameter Optimization', category: 'hyperparams', description: 'Hyperparameter optimization', status: 'active' },
    { id: 30, name: 'Performance Evaluation', category: 'evaluation', description: 'Performance evaluation metrics', status: 'active' }
  ];

  const categoryTitles = {
    qlearning: 'Q-Learning',
    dqn: 'Deep Q-Network',
    policy: 'Policy Gradient',
    actorcritic: 'Actor-Critic',
    ppo: 'Proximal Policy Optimization',
    trpo: 'Trust Region Policy Optimization',
    sac: 'Soft Actor-Critic',
    td3: 'Twin Delayed DDPG',
    multiagent: 'Multi-Agent RL',
    hierarchical: 'Hierarchical RL',
    meta: 'Meta-Learning',
    transfer: 'Transfer Learning',
    imitation: 'Imitation Learning',
    inverse: 'Inverse RL',
    adversarial: 'Adversarial RL',
    safe: 'Safe RL',
    robust: 'Robust RL',
    online: 'Online Learning',
    offline: 'Offline RL',
    modelbased: 'Model-Based RL',
    modelfree: 'Model-Free RL',
    value: 'Value Function',
    policyapprox: 'Policy Approximation',
    replay: 'Experience Replay',
    prioritized: 'Prioritized Replay',
    exploration: 'Exploration',
    reward: 'Reward Shaping',
    curriculum: 'Curriculum Learning',
    hyperparams: 'Hyperparameter Optimization',
    evaluation: 'Performance Evaluation'
  };

  useEffect(() => {
    // Simulate loading models
    const timer = setTimeout(() => {
      setIsLoading(false);
      setModels([
        {
          id: 1,
          name: 'Automated Response Agent',
          algorithm: 'Deep Q-Network',
          status: 'Training',
          performance: 87,
          episodes: 1500,
          lastUpdate: new Date().toISOString(),
          description: 'RL agent for automated threat response',
          metrics: ['Response Time: 0.3s', 'Success Rate: 94%', 'False Positives: 2%'],
          actions: ['Block IP', 'Quarantine File', 'Alert SOC', 'Update Rules'],
          detection: 'Reinforcement learning, automated response'
        },
        {
          id: 2,
          name: 'Adaptive Firewall',
          algorithm: 'Proximal Policy Optimization',
          status: 'Active',
          performance: 92,
          episodes: 2300,
          lastUpdate: new Date().toISOString(),
          description: 'RL-based adaptive firewall rules',
          metrics: ['Block Rate: 98%', 'Latency: 0.1s', 'Accuracy: 96%'],
          actions: ['Update Rules', 'Block Traffic', 'Allow Traffic', 'Log Event'],
          detection: 'Policy optimization, adaptive security'
        },
        {
          id: 3,
          name: 'Intrusion Prevention',
          algorithm: 'Actor-Critic',
          status: 'Learning',
          performance: 79,
          episodes: 800,
          lastUpdate: new Date().toISOString(),
          description: 'RL agent for intrusion prevention',
          metrics: ['Detection Rate: 91%', 'Precision: 88%', 'Recall: 93%'],
          actions: ['Prevent Attack', 'Isolate System', 'Notify Admin', 'Collect Evidence'],
          detection: 'Actor-critic learning, intrusion prevention'
        }
      ]);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Training': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Learning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getPerformanceColor = (performance) => {
    if (performance >= 90) return 'text-green-500';
    if (performance >= 80) return 'text-blue-500';
    if (performance >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const handleAnalyzeModel = (model) => {
    setSelectedModel(model);
    setShowAnalysis(true);
  };

  const closeAnalysis = () => {
    setShowAnalysis(false);
    setSelectedModel(null);
    setAnalysisResults(null);
  };

  const executeRLAnalysis = async () => {
    if (!analysisInput.trim()) return;
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      const mockResults = {
        performanceLevel: Math.random() > 0.6 ? 'High' : 'Excellent',
        confidence: Math.floor(Math.random() * 10) + 90,
        modelsDeployed: Math.floor(Math.random() * 15) + 5,
        automatedResponses: Math.floor(Math.random() * 50) + 20,
        learningRate: (Math.random() * 0.01 + 0.001).toFixed(4),
        accuracy: Math.floor(Math.random() * 10) + 90,
        recommendations: ['Optimize hyperparameters', 'Increase training data', 'Deploy multi-agent systems']
      };
      setAnalysisResults(mockResults);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateReport = async () => {
    if (!selectedModel) return;
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const report = {
        id: `RL-${Date.now()}`,
        title: `Reinforcement Learning Report: ${selectedModel.algorithm}`,
        generated: new Date().toISOString(),
        classification: 'CONFIDENTIAL - AI/ML SECURITY',
        summary: `Advanced reinforcement learning analysis reveals automated response capabilities and model performance metrics.`,
        keyFindings: ['RL models performing optimally', 'Automated response systems active', 'Learning convergence achieved'],
        recommendations: ['Scale RL deployment', 'Enhance reward functions', 'Implement multi-agent coordination'],
        technicalDetails: { analysisMethod: 'Reinforcement Learning Analysis', confidence: 94, performanceScore: 92 }
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
    if (!selectedModel) return;
    try {
      const exportData = { model: selectedModel, analysisResults, timestamp: new Date().toISOString(), format: 'JSON', source: 'Reinforcement Learning System' };
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reinforcement-learning-${selectedModel.id}-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      alert('Reinforcement learning data exported successfully!');
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
            <p className="cyber-text-muted mt-4">Loading reinforcement learning models...</p>
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
            Reinforcement Learning
          </h1>
          <p className="cyber-text-secondary">
            AI-powered automated response and adaptive security using reinforcement learning
          </p>
        </div>

        {/* Master Input */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter algorithm name, model type, or performance metric for RL analysis..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-200">
              Execute RL Analysis
            </button>
          </div>
        </div>

        {/* Function Categories */}
        {Object.entries(categoryTitles).map(([category, title]) => {
          const categoryFunctions = rlFunctions.filter(func => func.category === category);
          
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
                    onClick={() => handleAnalyzeModel(func)}
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
                        Train
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Live RL Model Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold cyber-text-primary mb-4 text-center">
            Live RL Model Performance
          </h2>
          <div className="space-y-4">
            {models.map((model) => (
              <div
                key={model.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold cyber-text-primary">
                      {model.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(model.status)}`}>
                      {model.status}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full text-xs font-semibold">
                      {model.algorithm}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPerformanceColor(model.performance)}`}>
                      {model.performance}% Performance
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-semibold">
                      {model.episodes} Episodes
                    </span>
                  </div>
                </div>
                <p className="text-sm cyber-text-secondary mb-2">
                  {model.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs cyber-text-muted mb-2">
                  <div>
                    <span className="font-semibold">Algorithm:</span> {model.algorithm}
                  </div>
                  <div>
                    <span className="font-semibold">Last Update:</span> {new Date(model.lastUpdate).toLocaleString()}
                  </div>
                </div>
                <div className="mb-2">
                  <span className="text-xs cyber-text-muted">Metrics: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {model.metrics.map((metric, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-xs">
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mb-2">
                  <span className="text-xs cyber-text-muted">Actions: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {model.actions.map((action, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-xs">
                        {action}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xs cyber-text-muted">Detection: </span>
                  <span className="text-xs cyber-accent-blue">
                    {model.detection}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis Modal */}
        {showAnalysis && selectedModel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold cyber-text-primary">
                    {selectedModel.name} Analysis
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
                      {selectedModel.description}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Status</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      selectedModel.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {selectedModel.status}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Category</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
                      {selectedModel.category.toUpperCase()}
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

export default ReinforcementLearning;

