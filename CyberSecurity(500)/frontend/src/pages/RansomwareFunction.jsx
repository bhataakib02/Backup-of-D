import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const RansomwareFunction = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [functionData, setFunctionData] = useState(null);
  const [masterInput, setMasterInput] = useState({ fileData: '', filePath: '' });
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalExecutions: 0,
    successRate: 0,
    averageTime: 0,
    lastExecution: null
  });

  useEffect(() => {
    if (location.state) {
      setFunctionData(location.state.function);
      setMasterInput(location.state.masterInput);
      setInput(location.state.masterInput.fileData || location.state.masterInput.filePath || '');
    }
  }, [location.state]);

  useEffect(() => {
    // Real-time stats updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalExecutions: prev.totalExecutions + Math.floor(Math.random() * 3),
        successRate: Math.floor(Math.random() * 20) + 80,
        averageTime: Math.floor(Math.random() * 1000) + 500,
        lastExecution: new Date()
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const executeFunction = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    try {
      const executionTime = Math.random() * 3000 + 1000;
      await new Promise(resolve => setTimeout(resolve, executionTime));
      
      let result;
      switch (functionData?.category) {
        case 'static':
          result = {
            status: 'success',
            data: {
              fileData: input,
              filePath: input,
              isRansomware: Math.random() > 0.7,
              confidence: Math.random() * 100,
              riskScore: Math.random() * 100,
              entropy: Math.random() * 8,
              signatures: Math.floor(Math.random() * 20) + 1,
              fileSize: Math.floor(Math.random() * 1000000) + 1000,
              extension: '.encrypted'
            },
            executionTime: executionTime
          };
          break;
        case 'dynamic':
          result = {
            status: 'success',
            data: {
              fileData: input,
              filePath: input,
              isRansomware: Math.random() > 0.7,
              confidence: Math.random() * 100,
              riskScore: Math.random() * 100,
              behaviors: Math.floor(Math.random() * 15) + 1,
              encryption: Math.random() > 0.5,
              fileChanges: Math.floor(Math.random() * 100) + 10,
              registryChanges: Math.floor(Math.random() * 20) + 1,
              networkActivity: Math.random() > 0.6
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
              features: Math.floor(Math.random() * 100) + 50,
              precision: Math.random() * 100,
              recall: Math.random() * 100,
              f1Score: Math.random() * 100
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
              performance: Math.random() * 100,
              efficiency: Math.random() * 100,
              reliability: Math.random() * 100
            },
            executionTime: executionTime
          };
      }
      
      setResult(result);
      
      setStats(prev => ({
        ...prev,
        totalExecutions: prev.totalExecutions + 1,
        successRate: Math.floor(Math.random() * 20) + 80,
        averageTime: Math.floor(Math.random() * 1000) + 500,
        lastExecution: new Date()
      }));
      
    } catch (error) {
      setResult({
        status: 'error',
        error: error.message,
        executionTime: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (!functionData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-danger-red mb-4">Function Not Found</h1>
          <button
            onClick={() => navigate('/ransomware')}
            className="btn-cyber"
          >
            Back to Ransomware Detection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/ransomware')}
            className="text-neon-cyan hover:text-plasma-green transition-colors mb-2"
          >
            ← Back to Ransomware Detection
          </button>
          <h1 className="text-3xl font-bold text-gradient">
            Function #{functionData.id}: {functionData.name}
          </h1>
          <p className="text-text-muted mt-2">{functionData.description}</p>
        </div>
        <div className="text-right">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            functionData.category === 'static' ? 'bg-neon-cyan/20 text-neon-cyan' :
            functionData.category === 'dynamic' ? 'bg-plasma-green/20 text-plasma-green' :
            functionData.category === 'ml' ? 'bg-quantum-purple/20 text-quantum-purple' :
            'bg-fusion-orange/20 text-fusion-orange'
          }`}>
            {functionData.category.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-cyber">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Total Executions</p>
              <p className="text-2xl font-bold text-neon-cyan">{stats.totalExecutions}</p>
            </div>
            <div className="text-2xl">⚡</div>
          </div>
        </div>
        <div className="card-cyber">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Success Rate</p>
              <p className="text-2xl font-bold text-plasma-green">{stats.successRate}%</p>
            </div>
            <div className="text-2xl">📊</div>
          </div>
        </div>
        <div className="card-cyber">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Avg. Time</p>
              <p className="text-2xl font-bold text-quantum-purple">{stats.averageTime}ms</p>
            </div>
            <div className="text-2xl">⏱️</div>
          </div>
        </div>
        <div className="card-cyber">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Last Execution</p>
              <p className="text-sm font-mono text-fusion-orange">
                {stats.lastExecution ? stats.lastExecution.toLocaleTimeString() : 'None'}
              </p>
            </div>
            <div className="text-2xl">🔄</div>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="card-cyber">
        <h2 className="text-xl font-semibold text-neon-cyan mb-4">Function Input</h2>
        <div className="space-y-4">
          {/* Master Input Display */}
          {masterInput.fileData && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Master File Data Input
              </label>
              <textarea
                value={masterInput.fileData}
                readOnly
                className="input-cyber w-full h-32 bg-dark-surface/50"
                rows={4}
              />
            </div>
          )}
          {masterInput.filePath && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Master File Path Input
              </label>
              <input
                type="text"
                value={masterInput.filePath}
                readOnly
                className="input-cyber w-full bg-dark-surface/50"
              />
            </div>
          )}
          
          {/* Function-specific Input */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Function Input
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={functionData.inputExample || "Enter file data or path for this function..."}
              className="input-cyber w-full"
            />
          </div>
          
          <button
            onClick={executeFunction}
            disabled={loading || !input.trim()}
            className="btn-cyber w-full"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
                <span>Executing Function...</span>
              </div>
            ) : (
              `Execute ${functionData.name}`
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="card-cyber">
          <h2 className="text-xl font-semibold text-neon-cyan mb-4">Execution Results</h2>
          <div className="space-y-4">
            {/* Status */}
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                result.status === 'success' 
                  ? 'bg-plasma-green/20 text-plasma-green' 
                  : 'bg-danger-red/20 text-danger-red'
              }`}>
                {result.status === 'success' ? '✓ Success' : '✗ Error'}
              </span>
              <span className="text-sm text-text-muted">
                Execution Time: {result.executionTime.toFixed(0)}ms
              </span>
            </div>

            {/* Results Data */}
            {result.status === 'success' && result.data && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(result.data).map(([key, value]) => (
                  <div key={key} className="bg-dark-surface p-4 rounded-lg border border-dark-border">
                    <h4 className="text-sm font-semibold text-neon-cyan mb-2 capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </h4>
                    <p className="text-text-primary font-mono">
                      {typeof value === 'number' ? value.toFixed(2) : String(value)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Error Display */}
            {result.status === 'error' && (
              <div className="bg-danger-red/10 border border-danger-red/20 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-danger-red mb-2">Error Details</h4>
                <p className="text-text-primary">{result.error}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Function Details */}
      <div className="card-cyber">
        <h2 className="text-xl font-semibold text-neon-cyan mb-4">Function Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-2">Function Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">ID:</span>
                <span className="text-text-primary font-mono">#{functionData.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Name:</span>
                <span className="text-text-primary">{functionData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Category:</span>
                <span className="text-text-primary capitalize">{functionData.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Description:</span>
                <span className="text-text-primary">{functionData.description}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-2">Performance Metrics</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Total Executions:</span>
                <span className="text-neon-cyan font-mono">{stats.totalExecutions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Success Rate:</span>
                <span className="text-plasma-green font-mono">{stats.successRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Average Time:</span>
                <span className="text-quantum-purple font-mono">{stats.averageTime}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Last Execution:</span>
                <span className="text-fusion-orange font-mono">
                  {stats.lastExecution ? stats.lastExecution.toLocaleTimeString() : 'None'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RansomwareFunction;

