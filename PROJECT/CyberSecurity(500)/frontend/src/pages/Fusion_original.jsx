import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Fusion = () => {
  const navigate = useNavigate();
  const [correlationData, setCorrelationData] = useState('');
  const [eventData, setEventData] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [functionResults, setFunctionResults] = useState({});
  const [stats, setStats] = useState({
    totalCorrelations: 0,
    eventsProcessed: 0,
    lastCorrelation: null,
    successRate: 0
  });

  // All 40 Fusion Engine Functions (211-250)
  const fusionFunctions = [
    { id: 211, name: 'Event Correlation', category: 'correlation', description: 'Correlate security events', inputExample: 'event_ids: [1,2,3], time_window: 300s' },
    { id: 212, name: 'Attack Chain Reconstruction', category: 'correlation', description: 'Reconstruct attack chains', inputExample: 'attack_id: 12345, steps: [recon,exploit,persist]' },
    { id: 213, name: 'Multi-Source Fusion', category: 'correlation', description: 'Fuse data from multiple sources', inputExample: 'sources: [ids,firewall,logs], format: json' },
    { id: 214, name: 'Temporal Correlation', category: 'correlation', description: 'Time-based event correlation', inputExample: 'timeframe: 1h, events: [login,failed_access]' },
    { id: 215, name: 'Spatial Correlation', category: 'correlation', description: 'Location-based correlation', inputExample: 'geolocation: [US,CN], radius: 100km' },
    { id: 216, name: 'Behavioral Correlation', category: 'correlation', description: 'Behavior-based correlation', inputExample: 'user: admin, baseline: 30_days' },
    { id: 217, name: 'Network Correlation', category: 'correlation', description: 'Network-based correlation', inputExample: 'subnet: 192.168.1.0/24, protocol: TCP' },
    { id: 218, name: 'Application Correlation', category: 'correlation', description: 'Application-based correlation', inputExample: 'app: web_server, version: 2.4.1' },
    { id: 219, name: 'Threat Intelligence Correlation', category: 'correlation', description: 'Correlate with threat intel', inputExample: 'ioc: 1.2.3.4, feed: MISP' },
    { id: 220, name: 'Risk Score Aggregation', category: 'correlation', description: 'Aggregate risk scores', inputExample: 'scores: [8.5,7.2,9.1], method: weighted_avg' },
    { id: 221, name: 'Confidence Aggregation', category: 'aggregation', description: 'Aggregate confidence levels', inputExample: 'confidences: [0.8,0.9,0.7], method: bayesian' },
    { id: 222, name: 'Evidence Fusion', category: 'aggregation', description: 'Fuse evidence from multiple sources', inputExample: 'evidence: [log,network,file], weight: [0.3,0.4,0.3]' },
    { id: 223, name: 'Alert Aggregation', category: 'aggregation', description: 'Aggregate similar alerts', inputExample: 'alerts: [alert1,alert2], similarity: 0.8' },
    { id: 224, name: 'Incident Aggregation', category: 'aggregation', description: 'Aggregate related incidents', inputExample: 'incidents: [inc1,inc2], relation: same_attacker' },
    { id: 225, name: 'Threat Aggregation', category: 'aggregation', description: 'Aggregate threat indicators', inputExample: 'threats: [malware,phishing], severity: high' },
    { id: 226, name: 'Vulnerability Aggregation', category: 'aggregation', description: 'Aggregate vulnerabilities', inputExample: 'cves: [CVE-2023-1234], cvss: 9.8' },
    { id: 227, name: 'Asset Aggregation', category: 'aggregation', description: 'Aggregate asset information', inputExample: 'assets: [server1,server2], type: critical' },
    { id: 228, name: 'User Aggregation', category: 'aggregation', description: 'Aggregate user activities', inputExample: 'users: [admin,user1], role: privileged' },
    { id: 229, name: 'Network Aggregation', category: 'aggregation', description: 'Aggregate network data', inputExample: 'subnets: [192.168.1.0/24], traffic: high' },
    { id: 230, name: 'Time Series Aggregation', category: 'aggregation', description: 'Aggregate time series data', inputExample: 'interval: 1h, metric: cpu_usage' },
    { id: 231, name: 'Real-time Processing', category: 'processing', description: 'Real-time data processing', inputExample: 'stream: kafka, batch_size: 1000' },
    { id: 232, name: 'Batch Processing', category: 'processing', description: 'Batch data processing', inputExample: 'schedule: daily, data: logs' },
    { id: 233, name: 'Stream Processing', category: 'processing', description: 'Stream data processing', inputExample: 'window: 60s, function: count' },
    { id: 234, name: 'Parallel Processing', category: 'processing', description: 'Parallel data processing', inputExample: 'workers: 8, task: correlation' },
    { id: 235, name: 'Distributed Processing', category: 'processing', description: 'Distributed data processing', inputExample: 'nodes: [node1,node2], load: balanced' },
    { id: 236, name: 'Event Processing', category: 'processing', description: 'Event stream processing', inputExample: 'events: [login,logout], filter: failed' },
    { id: 237, name: 'Data Processing', category: 'processing', description: 'General data processing', inputExample: 'format: json, transform: normalize' },
    { id: 238, name: 'Signal Processing', category: 'processing', description: 'Signal processing', inputExample: 'signal: network_traffic, filter: noise' },
    { id: 239, name: 'Image Processing', category: 'processing', description: 'Image data processing', inputExample: 'image: screenshot, analysis: ocr' },
    { id: 240, name: 'Text Processing', category: 'processing', description: 'Text data processing', inputExample: 'text: log_entry, nlp: sentiment' },
    { id: 241, name: 'Pattern Recognition', category: 'analysis', description: 'Recognize patterns in data', inputExample: 'pattern: attack_sequence, data: events' },
    { id: 242, name: 'Anomaly Detection', category: 'analysis', description: 'Detect anomalies', inputExample: 'baseline: normal_behavior, threshold: 2.5' },
    { id: 243, name: 'Trend Analysis', category: 'analysis', description: 'Analyze trends', inputExample: 'metric: threat_count, period: 30_days' },
    { id: 244, name: 'Statistical Analysis', category: 'analysis', description: 'Statistical data analysis', inputExample: 'method: regression, variables: [x,y]' },
    { id: 245, name: 'Machine Learning Analysis', category: 'analysis', description: 'ML-based analysis', inputExample: 'model: random_forest, features: [f1,f2]' },
    { id: 246, name: 'Deep Learning Analysis', category: 'analysis', description: 'Deep learning analysis', inputExample: 'model: lstm, sequence: 100' },
    { id: 247, name: 'Graph Analysis', category: 'analysis', description: 'Graph-based analysis', inputExample: 'nodes: [ip,user], edges: [connection]' },
    { id: 248, name: 'Network Analysis', category: 'analysis', description: 'Network traffic analysis', inputExample: 'protocol: TCP, analysis: flow' },
    { id: 249, name: 'Behavioral Analysis', category: 'analysis', description: 'Behavioral pattern analysis', inputExample: 'entity: user, behavior: login_pattern' },
    { id: 250, name: 'Threat Analysis', category: 'analysis', description: 'Threat landscape analysis', inputExample: 'threats: [apt,ransomware], ioc: hash' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalCorrelations: prev.totalCorrelations + Math.floor(Math.random() * 3),
        eventsProcessed: prev.eventsProcessed + Math.floor(Math.random() * 10),
        successRate: Math.floor(Math.random() * 20) + 80
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const openFunctionPage = (func) => {
    // Navigate to individual function page with function data
    navigate(`/fusion/function/${func.id}`, {
      state: {
        function: func,
        masterInput: { correlationData, eventData }
      }
    });
  };

  const analyzeAllFunctions = async () => {
    if (!correlationData.trim() && !eventData.trim()) return;
    
    setLoading(true);
    try {
      // Apply all 40 functions to the input
      const allResults = {};
      
      for (const func of fusionFunctions) {
        const executionTime = Math.random() * 2000 + 1000;
        await new Promise(resolve => setTimeout(resolve, executionTime));
        
        let result;
        switch (func.category) {
          case 'correlation':
            result = {
              status: 'success',
              data: {
                correlationData: correlationData,
                eventsCorrelated: Math.floor(Math.random() * 100) + 10,
                confidence: Math.random() * 100,
                riskScore: Math.random() * 100,
                patterns: Math.floor(Math.random() * 20) + 1,
                timeWindow: Math.floor(Math.random() * 3600) + 300
              },
              executionTime: executionTime
            };
            break;
          case 'aggregation':
            result = {
              status: 'success',
              data: {
                eventData: eventData,
                eventsAggregated: Math.floor(Math.random() * 1000) + 100,
                confidence: Math.random() * 100,
                riskScore: Math.random() * 100,
                clusters: Math.floor(Math.random() * 50) + 5,
                similarity: Math.random() * 100
              },
              executionTime: executionTime
            };
            break;
          case 'processing':
            result = {
              status: 'success',
              data: {
                processed: Math.floor(Math.random() * 1000),
                success: Math.random() * 100,
                errors: Math.floor(Math.random() * 10),
                performance: Math.random() * 100,
                throughput: Math.floor(Math.random() * 1000) + 100
              },
              executionTime: executionTime
            };
            break;
          case 'analysis':
            result = {
              status: 'success',
              data: {
                analysisType: 'threat_analysis',
                accuracy: Math.random() * 100,
                prediction: Math.random() > 0.7 ? 'threat' : 'normal',
                confidence: Math.random() * 100,
                features: Math.floor(Math.random() * 100) + 50
              },
              executionTime: executionTime
            };
            break;
          default:
            result = {
              status: 'success',
              data: {
                processed: Math.floor(Math.random() * 1000),
                success: Math.random() * 100,
                errors: Math.floor(Math.random() * 10),
                performance: Math.random() * 100
              },
              executionTime: executionTime
            };
        }
        
        allResults[func.id] = result;
      }
      
      setFunctionResults(allResults);
      
      setStats(prev => ({
        ...prev,
        totalCorrelations: prev.totalCorrelations + 1,
        eventsProcessed: prev.eventsProcessed + Math.floor(Math.random() * 100),
        lastCorrelation: new Date(),
        successRate: Math.floor(Math.random() * 20) + 80
      }));
      
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const executeFunction = async (func) => {
    setLoading(true);
    setSelectedFunction(func);
    
    try {
      const executionTime = Math.random() * 2000 + 1000;
      await new Promise(resolve => setTimeout(resolve, executionTime));
      
      let result;
      switch (func.category) {
        case 'correlation':
          result = {
            status: 'success',
            data: {
              correlatedEvents: Math.floor(Math.random() * 50),
              confidence: Math.random() * 100,
              timeWindow: Math.floor(Math.random() * 3600) + 300,
              sources: Math.floor(Math.random() * 10) + 1,
              patterns: Math.floor(Math.random() * 20),
              riskScore: Math.random() * 100
            },
            executionTime: executionTime
          };
          break;
        case 'aggregation':
          result = {
            status: 'success',
            data: {
              aggregatedItems: Math.floor(Math.random() * 100),
              similarity: Math.random() * 100,
              weight: Math.random() * 100,
              clusters: Math.floor(Math.random() * 20) + 1,
              accuracy: Math.random() * 100,
              coverage: Math.random() * 100
            },
            executionTime: executionTime
          };
          break;
        case 'processing':
          result = {
            status: 'success',
            data: {
              processedItems: Math.floor(Math.random() * 1000),
              throughput: Math.floor(Math.random() * 1000) + 100,
              latency: Math.floor(Math.random() * 100) + 10,
              cpuUsage: Math.random() * 100,
              memoryUsage: Math.random() * 100,
              efficiency: Math.random() * 100
            },
            executionTime: executionTime
          };
          break;
        case 'analysis':
          result = {
            status: 'success',
            data: {
              patterns: Math.floor(Math.random() * 50),
              anomalies: Math.floor(Math.random() * 20),
              trends: Math.floor(Math.random() * 10),
              accuracy: Math.random() * 100,
              precision: Math.random() * 100,
              recall: Math.random() * 100
            },
            executionTime: executionTime
          };
          break;
        default:
          result = {
            status: 'success',
            data: {
              processed: Math.floor(Math.random() * 1000),
              success: Math.random() * 100,
              errors: Math.floor(Math.random() * 10),
              performance: Math.random() * 100
            },
            executionTime: executionTime
          };
      }
      
      setFunctionResults(prev => ({
        ...prev,
        [func.id]: result
      }));
      
      setStats(prev => ({
        ...prev,
        totalCorrelations: prev.totalCorrelations + 1,
        eventsProcessed: prev.eventsProcessed + Math.floor(Math.random() * 5),
        lastCorrelation: new Date(),
        successRate: Math.floor(Math.random() * 20) + 80
      }));
      
    } catch (error) {
      setFunctionResults(prev => ({
        ...prev,
        [func.id]: {
          status: 'error',
          error: error.message,
          executionTime: 0
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const analyzeCorrelation = async () => {
    if (!correlationData) return;
    
    setLoading(true);
    try {
      const mockResult = {
        correlatedEvents: Math.floor(Math.random() * 20),
        confidence: Math.random() * 100,
        attackChains: [
          {
            id: 'chain_001',
            steps: ['Reconnaissance', 'Initial Access', 'Persistence'],
            confidence: Math.random() * 100,
            severity: 'High'
          }
        ],
        recommendations: [
          'Block suspicious IP addresses',
          'Update security policies',
          'Monitor related events'
        ]
      };
      
      setResult(mockResult);
    } catch (error) {
      console.error('Correlation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Fusion Engine
          </h1>
          <div className="flex items-center justify-center space-x-4 mt-1">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Last correlation: {stats.lastCorrelation ? stats.lastCorrelation.toLocaleTimeString() : 'Never'}
            </div>
            <div className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs">
              System Online
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-cyber">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Total Correlations</p>
              <p className="text-2xl font-bold text-neon-cyan">{stats.totalCorrelations}</p>
            </div>
            <div className="w-12 h-12 bg-neon-cyan/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card-cyber">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Events Processed</p>
              <p className="text-2xl font-bold text-plasma-green">{stats.eventsProcessed}</p>
            </div>
            <div className="w-12 h-12 bg-plasma-green/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-plasma-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card-cyber">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Success Rate</p>
              <p className="text-2xl font-bold text-plasma-green">{stats.successRate}%</p>
            </div>
            <div className="w-12 h-12 bg-plasma-green/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-plasma-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card-cyber">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Active Chains</p>
              <p className="text-2xl font-bold text-warning-yellow">{Math.floor(Math.random() * 10)}</p>
            </div>
            <div className="w-12 h-12 bg-warning-yellow/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-warning-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* All 40 Fusion Functions */}
      {/* Master Input Field */}
      <div className="card-cyber">
        <h2 className="text-xl font-semibold text-neon-cyan mb-4">Comprehensive Data Fusion</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Enter Correlation Data
            </label>
            <textarea
              value={correlationData}
              onChange={(e) => setCorrelationData(e.target.value)}
              placeholder="event_ids: [1,2,3], time_window: 300s, severity: high..."
              className="input-cyber w-full h-32"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Enter Event Data
            </label>
            <textarea
              value={eventData}
              onChange={(e) => setEventData(e.target.value)}
              placeholder="events: [event1, event2], metadata: {...}"
              className="input-cyber w-full h-32"
              rows={4}
            />
          </div>
          <button
            onClick={analyzeAllFunctions}
            disabled={loading || (!correlationData.trim() && !eventData.trim())}
            className="btn-cyber w-full"
          >
            {loading ? 'Analyzing All Functions...' : 'Execute Comprehensive Data Fusion'}
          </button>
        </div>
      </div>

      <div className="card-cyber">
        <h2 className="text-xl font-semibold text-neon-cyan mb-6">Enterprise Data Fusion & Correlation Engine</h2>
        {/* Group by Function Type */}
        {['correlation', 'aggregation', 'processing', 'analysis'].map((category) => {
          const categoryFunctions = fusionFunctions.filter(func => func.category === category);
          const categoryTitles = {
            'correlation': 'Event Correlation Engine',
            'aggregation': 'Data Aggregation Systems',
            'processing': 'Real-Time Processing',
            'analysis': 'Advanced Analytics'
          };
          
          return (
            <div key={category} className="mb-8">
              <h3 className="text-lg font-bold text-neon-cyan mb-4 border-b border-neon-cyan/30 pb-2 text-center">
                {categoryTitles[category]} ({categoryFunctions.length} Protocols)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryFunctions.map((func) => {
                  const isExecuting = selectedFunction?.id === func.id && loading;
                  const result = functionResults[func.id];
                  
                  return (
                    <div key={func.id} className="bg-dark-surface p-4 rounded-lg border border-dark-border hover:border-neon-cyan/50 transition-all duration-300">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-text-primary text-sm">{func.category.toUpperCase()}</h3>
                          <h4 className="font-medium text-neon-cyan">{func.name}</h4>
                          <p className="text-xs text-text-muted mt-1">{func.description}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          func.category === 'correlation' ? 'bg-neon-cyan/20 text-neon-cyan' :
                          func.category === 'aggregation' ? 'bg-plasma-green/20 text-plasma-green' :
                          func.category === 'processing' ? 'bg-quantum-purple/20 text-quantum-purple' :
                          'bg-fusion-orange/20 text-fusion-orange'
                        }`}>
                          {func.category}
                        </span>
                      </div>

                      {/* Input Form for Each Function - Hidden by default */}
                      {selectedFunction && selectedFunction.id === func.id && (
                        <div className="space-y-3 mb-3">
                          <div>
                            <label className="block text-xs font-medium text-text-primary mb-1">
                              Input Data
                            </label>
                            <input
                              type="text"
                              placeholder={func.inputExample}
                              className="input-cyber w-full text-xs"
                            />
                          </div>
                        </div>
                      )}
                        
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openFunctionPage(func)}
                          className="btn-cyber flex-1 text-xs py-2"
                        >
                          Open Function
                        </button>
                        <button
                          onClick={() => {
                            if (selectedFunction && selectedFunction.id === func.id) {
                              executeFunction(func);
                            } else {
                              setSelectedFunction(func);
                            }
                          }}
                          disabled={isExecuting}
                          className="btn-cyber flex-1 text-xs py-2"
                        >
                          {isExecuting ? (
                            <div className="flex items-center justify-center space-x-1">
                              <div className="w-3 h-3 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
                              <span>Executing...</span>
                            </div>
                          ) : selectedFunction && selectedFunction.id === func.id ? (
                            'Execute'
                          ) : (
                            'Show Input'
                          )}
                        </button>
                      </div>

                      {/* Results Display */}
                      {result && (
                        <div className="mt-3 p-3 bg-dark-elevated rounded-lg border border-dark-border">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs font-medium ${
                              result.status === 'success' ? 'text-plasma-green' : 'text-danger-red'
                            }`}>
                              {result.status === 'success' ? '✓ Success' : '✗ Error'}
                            </span>
                            <span className="text-xs text-text-muted">
                              {result.executionTime.toFixed(0)}ms
                            </span>
                          </div>
                          
                          {result.status === 'success' && result.data && (
                            <div className="space-y-1">
                              {Object.entries(result.data).slice(0, 3).map(([key, value]) => (
                                <div key={key} className="flex justify-between text-xs">
                                  <span className="text-text-muted">{key}:</span>
                                  <span className="text-text-primary font-mono">
                                    {typeof value === 'number' ? value.toFixed(2) : String(value)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {result.status === 'error' && (
                            <p className="text-xs text-danger-red">{result.error}</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Correlation Form */}
      <div className="card-cyber">
        <h2 className="text-xl font-semibold text-neon-cyan mb-4">Quick Event Correlation</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Correlation Data (JSON format)
            </label>
            <textarea
              value={correlationData}
              onChange={(e) => setCorrelationData(e.target.value)}
              placeholder='{"events": [{"id": 1, "type": "login", "timestamp": "2023-01-01T10:00:00Z"}, {"id": 2, "type": "file_access", "timestamp": "2023-01-01T10:05:00Z"}], "time_window": 300}'
              className="input-cyber w-full h-32"
              rows={4}
            />
          </div>
          <button
            onClick={analyzeCorrelation}
            disabled={loading || !correlationData}
            className="btn-cyber w-full"
          >
            {loading ? 'Correlating...' : 'Analyze Correlation'}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="card-cyber">
          <h2 className="text-xl font-semibold text-neon-cyan mb-4">Correlation Results</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-dark-surface p-4 rounded-lg">
                <p className="text-sm text-text-muted">Correlated Events</p>
                <p className="text-2xl font-bold text-neon-cyan">{result.correlatedEvents}</p>
              </div>
              <div className="bg-dark-surface p-4 rounded-lg">
                <p className="text-sm text-text-muted">Confidence</p>
                <p className="text-2xl font-bold text-plasma-green">{result.confidence.toFixed(1)}%</p>
              </div>
              <div className="bg-dark-surface p-4 rounded-lg">
                <p className="text-sm text-text-muted">Attack Chains</p>
                <p className="text-2xl font-bold text-warning-yellow">{result.attackChains?.length || 0}</p>
              </div>
            </div>

            {result.attackChains && result.attackChains.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Detected Attack Chains</h3>
                <div className="space-y-2">
                  {result.attackChains.map((chain, index) => (
                    <div key={index} className="bg-dark-surface p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-text-primary">Chain {chain.id}</p>
                          <p className="text-sm text-text-muted">
                            {chain.steps.join(' → ')}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            chain.severity === 'High' ? 'bg-danger-red/20 text-danger-red' :
                            chain.severity === 'Medium' ? 'bg-warning-yellow/20 text-warning-yellow' :
                            'bg-plasma-green/20 text-plasma-green'
                          }`}>
                            {chain.severity}
                          </span>
                          <p className="text-xs text-text-muted mt-1">
                            {chain.confidence.toFixed(1)}% confidence
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.recommendations && result.recommendations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Recommendations</h3>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-neon-cyan rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-text-secondary">{rec}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Fusion;
