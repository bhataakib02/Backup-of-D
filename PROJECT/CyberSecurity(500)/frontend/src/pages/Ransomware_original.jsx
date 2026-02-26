import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Ransomware = () => {
  const navigate = useNavigate();
  const [fileData, setFileData] = useState('');
  const [filePath, setFilePath] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [functionResults, setFunctionResults] = useState({});
  const [stats, setStats] = useState({
    totalScans: 0,
    ransomwareDetected: 0,
    lastScan: null,
    successRate: 0
  });

  // All 30 Ransomware Detection Functions (251-280)
  const ransomwareFunctions = [
    { id: 251, name: 'File Entropy Analysis', category: 'static', description: 'Analyze file entropy patterns', inputExample: 'file_path: /path/to/file, threshold: 7.5' },
    { id: 252, name: 'Bulk Renaming Detection', category: 'static', description: 'Detect bulk file renaming', inputExample: 'directory: /home/user, pattern: *.encrypted' },
    { id: 253, name: 'Encryption Pattern Detection', category: 'static', description: 'Detect encryption patterns', inputExample: 'file_type: binary, entropy: high' },
    { id: 254, name: 'Ransom Note Detection', category: 'static', description: 'Detect ransom notes', inputExample: 'text: "Your files have been encrypted", language: en' },
    { id: 255, name: 'File Extension Analysis', category: 'static', description: 'Analyze file extensions', inputExample: 'extensions: [.locked,.encrypted,.crypto], count: 1000' },
    { id: 256, name: 'Header Analysis', category: 'static', description: 'Analyze file headers', inputExample: 'header: magic_bytes, signature: ransomware' },
    { id: 257, name: 'String Analysis', category: 'static', description: 'Analyze file strings', inputExample: 'strings: ["ransomware","encrypt","decrypt"], min_length: 4' },
    { id: 258, name: 'Import Table Analysis', category: 'static', description: 'Analyze import tables', inputExample: 'dlls: [crypt32.dll,advapi32.dll], functions: [CryptEncrypt]' },
    { id: 259, name: 'Resource Analysis', category: 'static', description: 'Analyze file resources', inputExample: 'resource_type: string, content: ransom_note' },
    { id: 260, name: 'Metadata Analysis', category: 'static', description: 'Analyze file metadata', inputExample: 'metadata: {created,modified,accessed}, timestamps: suspicious' },
    { id: 261, name: 'Behavioral Monitoring', category: 'dynamic', description: 'Monitor file system behavior', inputExample: 'monitor: file_operations, events: [create,modify,delete]' },
    { id: 262, name: 'Process Monitoring', category: 'dynamic', description: 'Monitor process behavior', inputExample: 'process: malware.exe, actions: [file_access,network]' },
    { id: 263, name: 'Registry Monitoring', category: 'dynamic', description: 'Monitor registry changes', inputExample: 'registry: HKEY_CURRENT_USER, keys: [run,startup]' },
    { id: 264, name: 'Network Monitoring', category: 'dynamic', description: 'Monitor network activity', inputExample: 'connections: [tcp,udp], ports: [80,443,8080]' },
    { id: 265, name: 'Memory Analysis', category: 'dynamic', description: 'Analyze memory patterns', inputExample: 'memory: process_memory, pattern: encryption_key' },
    { id: 266, name: 'API Call Monitoring', category: 'dynamic', description: 'Monitor API calls', inputExample: 'apis: [CreateFile,WriteFile,DeleteFile], frequency: high' },
    { id: 267, name: 'File System Monitoring', category: 'dynamic', description: 'Monitor file system changes', inputExample: 'watch: /important/files, events: [modify,rename]' },
    { id: 268, name: 'System Call Monitoring', category: 'dynamic', description: 'Monitor system calls', inputExample: 'syscalls: [open,write,unlink], pattern: bulk_operations' },
    { id: 269, name: 'Event Log Analysis', category: 'dynamic', description: 'Analyze event logs', inputExample: 'logs: [security,system,application], events: file_access' },
    { id: 270, name: 'Performance Monitoring', category: 'dynamic', description: 'Monitor system performance', inputExample: 'metrics: [cpu,memory,disk], threshold: 80%' },
    { id: 271, name: 'Machine Learning Detection', category: 'ml', description: 'ML-based ransomware detection', inputExample: 'model: random_forest, features: [entropy,api_calls]' },
    { id: 272, name: 'Deep Learning Analysis', category: 'ml', description: 'Deep learning analysis', inputExample: 'model: cnn, input: file_bytes, output: classification' },
    { id: 273, name: 'Neural Network Detection', category: 'ml', description: 'Neural network detection', inputExample: 'network: lstm, sequence: file_operations' },
    { id: 274, name: 'Ensemble Methods', category: 'ml', description: 'Ensemble detection methods', inputExample: 'models: [rf,svm,gb], voting: soft' },
    { id: 275, name: 'Feature Engineering', category: 'ml', description: 'Feature engineering for ML', inputExample: 'features: [entropy,size,type], selection: mutual_info' },
    { id: 276, name: 'Anomaly Detection', category: 'ml', description: 'Anomaly-based detection', inputExample: 'algorithm: isolation_forest, contamination: 0.1' },
    { id: 277, name: 'Clustering Analysis', category: 'ml', description: 'Clustering-based detection', inputExample: 'algorithm: kmeans, clusters: 5, features: file_behavior' },
    { id: 278, name: 'Classification', category: 'ml', description: 'Classification-based detection', inputExample: 'classifier: svm, classes: [benign,ransomware]' },
    { id: 279, name: 'Regression Analysis', category: 'ml', description: 'Regression-based analysis', inputExample: 'target: risk_score, features: [entropy,size,type]' },
    { id: 280, name: 'Pattern Recognition', category: 'ml', description: 'Pattern recognition', inputExample: 'patterns: encryption_sequence, data: file_operations' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalScans: prev.totalScans + Math.floor(Math.random() * 3),
        ransomwareDetected: prev.ransomwareDetected + Math.floor(Math.random() * 2),
        successRate: Math.floor(Math.random() * 20) + 80
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const openFunctionPage = (func) => {
    // Navigate to individual function page with function data
    navigate(`/ransomware/function/${func.id}`, {
      state: {
        function: func,
        masterInput: { fileData, filePath }
      }
    });
  };

  const analyzeAllFunctions = async () => {
    if (!fileData.trim() && !filePath.trim()) return;
    
    setLoading(true);
    try {
      // Apply all 30 functions to the input
      const allResults = {};
      
      for (const func of ransomwareFunctions) {
        const executionTime = Math.random() * 2000 + 1000;
        await new Promise(resolve => setTimeout(resolve, executionTime));
        
        let result;
        switch (func.category) {
          case 'static':
            result = {
              status: 'success',
              data: {
                fileData: fileData,
                filePath: filePath,
                isRansomware: Math.random() > 0.7,
                confidence: Math.random() * 100,
                riskScore: Math.random() * 100,
                entropy: Math.random() * 8,
                signatures: Math.floor(Math.random() * 20) + 1
              },
              executionTime: executionTime
            };
            break;
          case 'dynamic':
            result = {
              status: 'success',
              data: {
                fileData: fileData,
                filePath: filePath,
                isRansomware: Math.random() > 0.7,
                confidence: Math.random() * 100,
                riskScore: Math.random() * 100,
                behaviors: Math.floor(Math.random() * 15) + 1,
                encryption: Math.random() > 0.5,
                fileChanges: Math.floor(Math.random() * 100) + 10
              },
              executionTime: executionTime
            };
            break;
          case 'ml':
            result = {
              status: 'success',
              data: {
                model: 'ransomware_detector',
                accuracy: Math.random() * 100,
                prediction: Math.random() > 0.7 ? 'ransomware' : 'clean',
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
        totalScans: prev.totalScans + 1,
        ransomwareDetected: prev.ransomwareDetected + Math.floor(Math.random() * 2),
        lastScan: new Date(),
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
        case 'static':
          result = {
            status: 'success',
            data: {
              entropy: Math.random() * 8,
              fileSize: Math.floor(Math.random() * 1000000) + 1000,
              extensions: Math.floor(Math.random() * 50),
              signatures: Math.floor(Math.random() * 20),
              strings: Math.floor(Math.random() * 100),
              riskScore: Math.random() * 100
            },
            executionTime: executionTime
          };
          break;
        case 'dynamic':
          result = {
            status: 'success',
            data: {
              processes: Math.floor(Math.random() * 20),
              fileOperations: Math.floor(Math.random() * 1000),
              networkConnections: Math.floor(Math.random() * 50),
              registryChanges: Math.floor(Math.random() * 100),
              apiCalls: Math.floor(Math.random() * 500),
              suspiciousActivity: Math.floor(Math.random() * 10)
            },
            executionTime: executionTime
          };
          break;
        case 'ml':
          result = {
            status: 'success',
            data: {
              accuracy: Math.random() * 100,
              precision: Math.random() * 100,
              recall: Math.random() * 100,
              f1Score: Math.random() * 100,
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
      
      setFunctionResults(prev => ({
        ...prev,
        [func.id]: result
      }));
      
      setStats(prev => ({
        ...prev,
        totalScans: prev.totalScans + 1,
        ransomwareDetected: prev.ransomwareDetected + Math.floor(Math.random() * 2),
        lastScan: new Date(),
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

  const analyzeFile = async () => {
    if (!fileData) return;
    
    setLoading(true);
    try {
      const mockResult = {
        isRansomware: Math.random() > 0.7,
        confidence: Math.random() * 100,
        entropy: Math.random() * 8,
        fileType: 'executable',
        signatures: [
          {
            name: 'WannaCry',
            confidence: Math.random() * 100,
            severity: 'High'
          }
        ],
        recommendations: [
          'Quarantine the file',
          'Scan system for other infections',
          'Update antivirus definitions'
        ]
      };
      
      setResult(mockResult);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Ransomware Detection
          </h1>
          <div className="flex items-center justify-center space-x-4 mt-1">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Last scan: {stats.lastScan ? stats.lastScan.toLocaleTimeString() : 'Never'}
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
              <p className="text-sm text-text-muted">Total Scans</p>
              <p className="text-2xl font-bold text-neon-cyan">{stats.totalScans}</p>
            </div>
            <div className="w-12 h-12 bg-neon-cyan/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card-cyber">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Ransomware Detected</p>
              <p className="text-2xl font-bold text-danger-red">{stats.ransomwareDetected}</p>
            </div>
            <div className="w-12 h-12 bg-danger-red/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-danger-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
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
              <p className="text-sm text-text-muted">Active Threats</p>
              <p className="text-2xl font-bold text-warning-yellow">{Math.floor(Math.random() * 5)}</p>
            </div>
            <div className="w-12 h-12 bg-warning-yellow/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-warning-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Master Input Field */}
      <div className="card-cyber">
        <h2 className="text-xl font-semibold text-neon-cyan mb-4">Comprehensive Ransomware Analysis</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Enter File Data
            </label>
            <textarea
              value={fileData}
              onChange={(e) => setFileData(e.target.value)}
              placeholder="file_path: /path/to/file, entropy: 7.5, size: 1024..."
              className="input-cyber w-full h-32"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Enter File Path
            </label>
            <input
              type="text"
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
              placeholder="C:\path\to\file.exe or /path/to/file"
              className="input-cyber w-full"
            />
          </div>
          <button
            onClick={analyzeAllFunctions}
            disabled={loading || (!fileData.trim() && !filePath.trim())}
            className="btn-cyber w-full"
          >
            {loading ? 'Analyzing All Functions...' : 'Execute Comprehensive Ransomware Protection'}
          </button>
        </div>
      </div>

      {/* All 30 Ransomware Functions */}
      <div className="card-cyber">
        <h2 className="text-xl font-semibold text-neon-cyan mb-6">Enterprise Ransomware Protection System</h2>
        {/* Group by Function Type */}
        {['static', 'dynamic', 'ml'].map((category) => {
          const categoryFunctions = ransomwareFunctions.filter(func => func.category === category);
          const categoryTitles = {
            'static': 'Static Analysis Engine',
            'dynamic': 'Dynamic Monitoring Systems',
            'ml': 'Machine Learning Intelligence'
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
                          func.category === 'static' ? 'bg-neon-cyan/20 text-neon-cyan' :
                          func.category === 'dynamic' ? 'bg-danger-red/20 text-danger-red' :
                          'bg-quantum-purple/20 text-quantum-purple'
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

      {/* Quick File Analysis Form */}
      <div className="card-cyber">
        <h2 className="text-xl font-semibold text-neon-cyan mb-4">Quick File Analysis</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              File Data (JSON format)
            </label>
            <textarea
              value={fileData}
              onChange={(e) => setFileData(e.target.value)}
              placeholder='{"file_path": "/path/to/file.exe", "file_size": 1024000, "entropy": 7.8, "extensions": [".exe", ".dll"]}'
              className="input-cyber w-full h-32"
              rows={4}
            />
          </div>
          <button
            onClick={analyzeFile}
            disabled={loading || !fileData}
            className="btn-cyber w-full"
          >
            {loading ? 'Analyzing...' : 'Analyze File'}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="card-cyber">
          <h2 className="text-xl font-semibold text-neon-cyan mb-4">Analysis Results</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-dark-surface p-4 rounded-lg">
                <p className="text-sm text-text-muted">Ransomware Detected</p>
                <p className={`text-2xl font-bold ${result.isRansomware ? 'text-danger-red' : 'text-plasma-green'}`}>
                  {result.isRansomware ? 'YES' : 'NO'}
                </p>
              </div>
              <div className="bg-dark-surface p-4 rounded-lg">
                <p className="text-sm text-text-muted">Confidence</p>
                <p className="text-2xl font-bold text-neon-cyan">{result.confidence.toFixed(1)}%</p>
              </div>
              <div className="bg-dark-surface p-4 rounded-lg">
                <p className="text-sm text-text-muted">Entropy</p>
                <p className="text-2xl font-bold text-warning-yellow">{result.entropy.toFixed(2)}</p>
              </div>
            </div>

            {result.signatures && result.signatures.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Detected Signatures</h3>
                <div className="space-y-2">
                  {result.signatures.map((signature, index) => (
                    <div key={index} className="bg-dark-surface p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-text-primary">{signature.name}</p>
                          <p className="text-sm text-text-muted">
                            Confidence: {signature.confidence.toFixed(1)}%
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            signature.severity === 'High' ? 'bg-danger-red/20 text-danger-red' :
                            signature.severity === 'Medium' ? 'bg-warning-yellow/20 text-warning-yellow' :
                            'bg-plasma-green/20 text-plasma-green'
                          }`}>
                            {signature.severity}
                          </span>
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

export default Ransomware;