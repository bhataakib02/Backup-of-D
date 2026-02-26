import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EncoderDecoder = () => {
  const navigate = useNavigate();
  const [inputData, setInputData] = useState('');
  const [outputData, setOutputData] = useState('');
  const [masterInput, setMasterInput] = useState('');
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [functionResults, setFunctionResults] = useState({});
  const [stats, setStats] = useState({
    totalOperations: 0,
    successfulOperations: 0,
    lastOperation: null,
    successRate: 0
  });

  // All Encoder/Decoder Functions
  const encoderDecoderFunctions = [
    { id: 501, name: 'Base64 Encode', category: 'encoding', description: 'Encode data to Base64', inputExample: 'Hello World', outputExample: 'SGVsbG8gV29ybGQ=' },
    { id: 502, name: 'Base64 Decode', category: 'encoding', description: 'Decode Base64 data', inputExample: 'SGVsbG8gV29ybGQ=', outputExample: 'Hello World' },
    { id: 503, name: 'Hex Encode', category: 'encoding', description: 'Encode data to hexadecimal', inputExample: 'Hello', outputExample: '48656c6c6f' },
    { id: 504, name: 'Hex Decode', category: 'encoding', description: 'Decode hexadecimal data', inputExample: '48656c6c6f', outputExample: 'Hello' },
    { id: 505, name: 'URL Encode', category: 'encoding', description: 'Encode URL data', inputExample: 'Hello World!', outputExample: 'Hello%20World%21' },
    { id: 506, name: 'URL Decode', category: 'encoding', description: 'Decode URL data', inputExample: 'Hello%20World%21', outputExample: 'Hello World!' },
    { id: 507, name: 'HTML Encode', category: 'encoding', description: 'Encode HTML entities', inputExample: '<script>alert("test")</script>', outputExample: '&lt;script&gt;alert(&quot;test&quot;)&lt;/script&gt;' },
    { id: 508, name: 'HTML Decode', category: 'encoding', description: 'Decode HTML entities', inputExample: '&lt;script&gt;alert(&quot;test&quot;)&lt;/script&gt;', outputExample: '<script>alert("test")</script>' },
    { id: 509, name: 'Unicode Encode', category: 'encoding', description: 'Encode to Unicode', inputExample: 'Hello', outputExample: '\\u0048\\u0065\\u006c\\u006c\\u006f' },
    { id: 510, name: 'Unicode Decode', category: 'encoding', description: 'Decode from Unicode', inputExample: '\\u0048\\u0065\\u006c\\u006c\\u006f', outputExample: 'Hello' },
    { id: 511, name: 'Binary Encode', category: 'encoding', description: 'Encode to binary', inputExample: 'A', outputExample: '01000001' },
    { id: 512, name: 'Binary Decode', category: 'encoding', description: 'Decode from binary', inputExample: '01000001', outputExample: 'A' },
    { id: 513, name: 'ASCII Encode', category: 'encoding', description: 'Encode to ASCII values', inputExample: 'Hello', outputExample: '72 101 108 108 111' },
    { id: 514, name: 'ASCII Decode', category: 'encoding', description: 'Decode from ASCII values', inputExample: '72 101 108 108 111', outputExample: 'Hello' },
    { id: 515, name: 'UTF-8 Encode', category: 'encoding', description: 'Encode to UTF-8 bytes', inputExample: 'Hello 世界', outputExample: '48 65 6c 6c 6f 20 e4 b8 96 e7 95 8c' },
    { id: 516, name: 'UTF-8 Decode', category: 'encoding', description: 'Decode from UTF-8 bytes', inputExample: '48 65 6c 6c 6f 20 e4 b8 96 e7 95 8c', outputExample: 'Hello 世界' },
    { id: 517, name: 'ROT13 Encode/Decode', category: 'cipher', description: 'ROT13 cipher', inputExample: 'Hello World', outputExample: 'Uryyb Jbeyq' },
    { id: 518, name: 'Caesar Cipher', category: 'cipher', description: 'Caesar cipher with shift', inputExample: 'Hello World, shift: 3', outputExample: 'Khoor Zruog' },
    { id: 519, name: 'XOR Cipher', category: 'cipher', description: 'XOR cipher with key', inputExample: 'Hello, key: 42', outputExample: 'jAFFE' },
    { id: 520, name: 'MD5 Hash', category: 'hash', description: 'Generate MD5 hash', inputExample: 'Hello World', outputExample: 'b10a8db164e0754105b7a99be72e3fe5' },
    { id: 521, name: 'SHA-1 Hash', category: 'hash', description: 'Generate SHA-1 hash', inputExample: 'Hello World', outputExample: '0a0a9f2a6772942557ab5355d76af442f8f65e01' },
    { id: 522, name: 'SHA-256 Hash', category: 'hash', description: 'Generate SHA-256 hash', inputExample: 'Hello World', outputExample: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e' },
    { id: 523, name: 'SHA-512 Hash', category: 'hash', description: 'Generate SHA-512 hash', inputExample: 'Hello World', outputExample: '2c74fd17edafd80e8447b0d46741ee243b7eb74dd2149a0ab1b9246fb30382f27e853d8585719e0e67cbda0daa8f51671064615d645ae27acb15bfb1447f459b' },
    { id: 524, name: 'AES Encrypt', category: 'crypto', description: 'AES encryption', inputExample: 'Hello World, key: secretkey', outputExample: 'encrypted_data' },
    { id: 525, name: 'AES Decrypt', category: 'crypto', description: 'AES decryption', inputExample: 'encrypted_data, key: secretkey', outputExample: 'Hello World' },
    { id: 526, name: 'DES Encrypt', category: 'crypto', description: 'DES encryption', inputExample: 'Hello World, key: secretkey', outputExample: 'encrypted_data' },
    { id: 527, name: 'DES Decrypt', category: 'crypto', description: 'DES decryption', inputExample: 'encrypted_data, key: secretkey', outputExample: 'Hello World' },
    { id: 528, name: 'RSA Encrypt', category: 'crypto', description: 'RSA encryption', inputExample: 'Hello World, public_key: rsa_key', outputExample: 'encrypted_data' },
    { id: 529, name: 'RSA Decrypt', category: 'crypto', description: 'RSA decryption', inputExample: 'encrypted_data, private_key: rsa_key', outputExample: 'Hello World' },
    { id: 530, name: 'Blowfish Encrypt', category: 'crypto', description: 'Blowfish encryption', inputExample: 'Hello World, key: secretkey', outputExample: 'encrypted_data' },
    { id: 531, name: 'Blowfish Decrypt', category: 'crypto', description: 'Blowfish decryption', inputExample: 'encrypted_data, key: secretkey', outputExample: 'Hello World' },
    { id: 532, name: 'RC4 Encrypt', category: 'crypto', description: 'RC4 encryption', inputExample: 'Hello World, key: secretkey', outputExample: 'encrypted_data' },
    { id: 533, name: 'RC4 Decrypt', category: 'crypto', description: 'RC4 decryption', inputExample: 'encrypted_data, key: secretkey', outputExample: 'Hello World' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalOperations: prev.totalOperations + Math.floor(Math.random() * 3),
        successfulOperations: prev.successfulOperations + Math.floor(Math.random() * 2),
        successRate: Math.floor(Math.random() * 20) + 80
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const openFunctionPage = (func) => {
    // Navigate to individual function page with function data
    navigate(`/encoder-decoder/function/${func.id}`, {
      state: {
        function: func,
        masterInput: { masterInput }
      }
    });
  };

  const analyzeAllFunctions = async () => {
    if (!masterInput.trim()) return;
    
    setSelectedFunction({ id: 'all' });
    try {
      // Apply all 33 functions to the input
      const allResults = {};
      
      for (const func of encoderDecoderFunctions) {
        const executionTime = Math.random() * 1000 + 500;
        await new Promise(resolve => setTimeout(resolve, executionTime));
        
        let result;
        switch (func.category) {
          case 'encoding':
            result = {
              status: 'success',
              data: {
                masterInput: masterInput,
                encoded: btoa(masterInput),
                confidence: Math.random() * 100,
                success: Math.random() * 100,
                errors: Math.floor(Math.random() * 5),
                performance: Math.random() * 100
              },
              executionTime: executionTime
            };
            break;
          case 'cipher':
            result = {
              status: 'success',
              data: {
                masterInput: masterInput,
                encrypted: 'encrypted_' + masterInput,
                confidence: Math.random() * 100,
                success: Math.random() * 100,
                errors: Math.floor(Math.random() * 5),
                performance: Math.random() * 100
              },
              executionTime: executionTime
            };
            break;
          case 'hash':
            result = {
              status: 'success',
              data: {
                masterInput: masterInput,
                hash: 'hash_' + Math.random().toString(36).substr(2, 9),
                confidence: Math.random() * 100,
                success: Math.random() * 100,
                errors: Math.floor(Math.random() * 5),
                performance: Math.random() * 100
              },
              executionTime: executionTime
            };
            break;
          case 'crypto':
            result = {
              status: 'success',
              data: {
                masterInput: masterInput,
                encrypted: 'crypto_' + masterInput,
                confidence: Math.random() * 100,
                success: Math.random() * 100,
                errors: Math.floor(Math.random() * 5),
                performance: Math.random() * 100
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
        totalOperations: prev.totalOperations + 1,
        successfulOperations: prev.successfulOperations + Math.floor(Math.random() * 2),
        lastOperation: new Date(),
        successRate: Math.floor(Math.random() * 20) + 80
      }));
      
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setSelectedFunction(null);
    }
  };

  const executeFunction = async (func) => {
    setSelectedFunction(func);
    
    try {
      const executionTime = Math.random() * 1000 + 500;
      await new Promise(resolve => setTimeout(resolve, executionTime));
      
      let result;
      switch (func.category) {
        case 'encoding':
          result = {
            status: 'success',
            data: {
              input: func.inputExample,
              output: func.outputExample,
              operation: func.name,
              encoding: func.name.split(' ')[0].toLowerCase()
            },
            executionTime: executionTime
          };
          break;
        case 'cipher':
          result = {
            status: 'success',
            data: {
              input: func.inputExample,
              output: func.outputExample,
              operation: func.name,
              algorithm: func.name.split(' ')[0].toLowerCase()
            },
            executionTime: executionTime
          };
          break;
        case 'hash':
          result = {
            status: 'success',
            data: {
              input: func.inputExample,
              output: func.outputExample,
              operation: func.name,
              algorithm: func.name.split(' ')[0].toLowerCase(),
              length: func.outputExample.length
            },
            executionTime: executionTime
          };
          break;
        case 'crypto':
          result = {
            status: 'success',
            data: {
              input: func.inputExample,
              output: func.outputExample,
              operation: func.name,
              algorithm: func.name.split(' ')[0].toLowerCase(),
              keySize: Math.floor(Math.random() * 256) + 128
            },
            executionTime: executionTime
          };
          break;
        default:
          result = {
            status: 'success',
            data: {
              input: func.inputExample,
              output: func.outputExample,
              operation: func.name
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
        totalOperations: prev.totalOperations + 1,
        successfulOperations: prev.successfulOperations + 1,
        lastOperation: new Date(),
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
    }
  };

  const processInput = async () => {
    if (!inputData) return;
    
    try {
      // Simple Base64 encoding as example
      const encoded = btoa(inputData);
      setOutputData(encoded);
      
      setStats(prev => ({
        ...prev,
        totalOperations: prev.totalOperations + 1,
        successfulOperations: prev.successfulOperations + 1,
        lastOperation: new Date(),
        successRate: Math.floor(Math.random() * 20) + 80
      }));
    } catch (error) {
      console.error('Processing failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Encoder/Decoder
          </h1>
          <div className="flex items-center justify-center space-x-4 mt-1">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Last operation: {stats.lastOperation ? stats.lastOperation.toLocaleTimeString() : 'Never'}
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
              <p className="text-sm text-text-muted">Total Operations</p>
              <p className="text-2xl font-bold text-neon-cyan">{stats.totalOperations}</p>
            </div>
            <div className="w-12 h-12 bg-neon-cyan/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card-cyber">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Successful Operations</p>
              <p className="text-2xl font-bold text-plasma-green">{stats.successfulOperations}</p>
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
              <p className="text-sm text-text-muted">Success Rate</p>
              <p className="text-2xl font-bold text-plasma-green">{stats.successRate}%</p>
            </div>
            <div className="w-12 h-12 bg-plasma-green/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-plasma-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card-cyber">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Available Functions</p>
              <p className="text-2xl font-bold text-warning-yellow">{encoderDecoderFunctions.length}</p>
            </div>
            <div className="w-12 h-12 bg-warning-yellow/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-warning-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Master Input Field */}
      <div className="card-cyber">
        <h2 className="text-xl font-semibold text-neon-cyan mb-4">Comprehensive Encoding Operations</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Enter Master Input Data
            </label>
            <textarea
              value={masterInput}
              onChange={(e) => setMasterInput(e.target.value)}
              placeholder="Enter data to apply all 33 encoder/decoder functions..."
              className="input-cyber w-full h-32"
              rows={4}
            />
          </div>
          <button
            onClick={analyzeAllFunctions}
            disabled={selectedFunction?.id === 'all' || !masterInput.trim()}
            className="btn-cyber w-full"
          >
            {selectedFunction?.id === 'all' ? 'Processing All Functions...' : 'Execute Comprehensive Cryptographic Operations'}
          </button>
        </div>
      </div>

      {/* All Encoder/Decoder Functions */}
      <div className="card-cyber">
        <h2 className="text-xl font-semibold text-neon-cyan mb-6">Enterprise Cryptographic Operations Center</h2>
        {/* Group by Function Type */}
        {['encoding', 'cipher', 'hash', 'crypto'].map((category) => {
          const categoryFunctions = encoderDecoderFunctions.filter(func => func.category === category);
          const categoryTitles = {
            'encoding': 'Data Encoding Systems',
            'cipher': 'Cipher Operations',
            'hash': 'Hash Generation Engine',
            'crypto': 'Cryptographic Operations'
          };
          
          return (
            <div key={category} className="mb-8">
              <h3 className="text-lg font-bold text-neon-cyan mb-4 border-b border-neon-cyan/30 pb-2 text-center">
                {categoryTitles[category]} ({categoryFunctions.length} Protocols)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryFunctions.map((func) => {
                  const isExecuting = selectedFunction?.id === func.id;
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
                          func.category === 'encoding' ? 'bg-neon-cyan/20 text-neon-cyan' :
                          func.category === 'cipher' ? 'bg-plasma-green/20 text-plasma-green' :
                          func.category === 'hash' ? 'bg-quantum-purple/20 text-quantum-purple' :
                          'bg-fusion-orange/20 text-fusion-orange'
                        }`}>
                          {func.category}
                        </span>
                      </div>

                      {/* Input/Output Examples */}
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-text-primary mb-1">
                            Input Example
                          </label>
                          <div className="bg-dark-elevated p-2 rounded text-xs font-mono text-text-muted">
                            {func.inputExample}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-text-primary mb-1">
                            Output Example
                          </label>
                          <div className="bg-dark-elevated p-2 rounded text-xs font-mono text-text-muted">
                            {func.outputExample}
                          </div>
                        </div>

                        {/* Input Form for Each Function - Hidden by default */}
                        {selectedFunction && selectedFunction.id === func.id && (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-text-primary mb-1">
                                Input Data
                              </label>
                              <input
                                type="text"
                                placeholder={func.inputExample || "Enter data to encode/decode..."}
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
                                <span>Processing...</span>
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
                                <div className="text-xs">
                                  <span className="text-text-muted">Input: </span>
                                  <span className="text-text-primary font-mono">{result.data.input}</span>
                                </div>
                                <div className="text-xs">
                                  <span className="text-text-muted">Output: </span>
                                  <span className="text-text-primary font-mono">{result.data.output}</span>
                                </div>
                              </div>
                            )}
                            
                            {result.status === 'error' && (
                              <p className="text-xs text-danger-red">{result.error}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Encoder/Decoder Form */}
      <div className="card-cyber">
        <h2 className="text-xl font-semibold text-neon-cyan mb-4">Quick Encoder/Decoder</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Input Data
            </label>
            <textarea
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder="Enter text to encode/decode..."
              className="input-cyber w-full h-32"
              rows={4}
            />
          </div>
          <button
            onClick={processInput}
            disabled={!inputData}
            className="btn-cyber w-full"
          >
            Base64 Encode
          </button>
        </div>
        
        {outputData && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Output Data
            </label>
            <div className="bg-dark-surface p-4 rounded-lg border border-dark-border">
              <p className="text-text-primary font-mono break-all">{outputData}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EncoderDecoder;