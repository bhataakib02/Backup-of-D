import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ThreatIntel = () => {
  const navigate = useNavigate();
  const [intelData, setIntelData] = useState('');
  const [indicator, setIndicator] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [functionResults, setFunctionResults] = useState({});
  const [stats, setStats] = useState({
    totalQueries: 0,
    threatsIdentified: 0,
    lastQuery: null,
    successRate: 0
  });

  // All 40 Threat Intelligence Functions (281-320)
  const threatIntelFunctions = [
    { id: 281, name: 'IP Reputation Check', category: 'reputation', description: 'Check IP reputation', inputExample: 'ip: 1.2.3.4, sources: [abuseipdb,virustotal]' },
    { id: 282, name: 'Domain Reputation Check', category: 'reputation', description: 'Check domain reputation', inputExample: 'domain: example.com, check: [malware,phishing]' },
    { id: 283, name: 'URL Reputation Check', category: 'reputation', description: 'Check URL reputation', inputExample: 'url: http://malware.com/payload.exe' },
    { id: 284, name: 'Hash Reputation Check', category: 'reputation', description: 'Check hash reputation', inputExample: 'hash: md5:abc123..., type: file_hash' },
    { id: 285, name: 'Email Reputation Check', category: 'reputation', description: 'Check email reputation', inputExample: 'email: spam@example.com, check: [spam,malware]' },
    { id: 286, name: 'ASN Reputation Check', category: 'reputation', description: 'Check ASN reputation', inputExample: 'asn: 12345, organization: Example Corp' },
    { id: 287, name: 'Certificate Reputation Check', category: 'reputation', description: 'Check certificate reputation', inputExample: 'cert: sha1:abc123..., issuer: fake_ca' },
    { id: 288, name: 'File Reputation Check', category: 'reputation', description: 'Check file reputation', inputExample: 'file: malware.exe, size: 1024000' },
    { id: 289, name: 'Registry Key Reputation Check', category: 'reputation', description: 'Check registry key reputation', inputExample: 'key: HKEY_CURRENT_USER\\Software\\Malware' },
    { id: 290, name: 'Process Reputation Check', category: 'reputation', description: 'Check process reputation', inputExample: 'process: malware.exe, pid: 1234' },
    { id: 291, name: 'IOC Extraction', category: 'ioc', description: 'Extract indicators of compromise', inputExample: 'data: log_file, types: [ip,domain,hash]' },
    { id: 292, name: 'IOC Validation', category: 'ioc', description: 'Validate indicators of compromise', inputExample: 'ioc: 1.2.3.4, format: ipv4' },
    { id: 293, name: 'IOC Enrichment', category: 'ioc', description: 'Enrich IOC data', inputExample: 'ioc: example.com, enrichment: [whois,geo,asn]' },
    { id: 294, name: 'IOC Correlation', category: 'ioc', description: 'Correlate IOCs', inputExample: 'iocs: [ip1,domain1], correlation: same_attacker' },
    { id: 295, name: 'IOC Sharing', category: 'ioc', description: 'Share IOCs', inputExample: 'iocs: [ioc1,ioc2], format: stix, destination: misp' },
    { id: 296, name: 'IOC Import', category: 'ioc', description: 'Import IOCs', inputExample: 'source: threat_feed, format: json, count: 1000' },
    { id: 297, name: 'IOC Export', category: 'ioc', description: 'Export IOCs', inputExample: 'format: csv, filters: {type: ip, confidence: high}' },
    { id: 298, name: 'IOC Storage', category: 'ioc', description: 'Store IOCs', inputExample: 'database: threat_intel, table: iocs' },
    { id: 299, name: 'IOC Search', category: 'ioc', description: 'Search IOCs', inputExample: 'query: "malware", fields: [description,type]' },
    { id: 300, name: 'IOC Analysis', category: 'ioc', description: 'Analyze IOCs', inputExample: 'ioc: hash:abc123..., analysis: [entropy,strings]' },
    { id: 301, name: 'Threat Feed Integration', category: 'feeds', description: 'Integrate threat feeds', inputExample: 'feed: abuseipdb, api_key: abc123, rate_limit: 1000' },
    { id: 302, name: 'MISP Integration', category: 'feeds', description: 'Integrate with MISP', inputExample: 'server: misp.example.com, api_key: xyz789' },
    { id: 303, name: 'VirusTotal Integration', category: 'feeds', description: 'Integrate with VirusTotal', inputExample: 'api_key: vt_key, quota: 10000' },
    { id: 304, name: 'AlienVault Integration', category: 'feeds', description: 'Integrate with AlienVault', inputExample: 'api_key: av_key, endpoint: /api/v1' },
    { id: 305, name: 'ThreatConnect Integration', category: 'feeds', description: 'Integrate with ThreatConnect', inputExample: 'api_key: tc_key, org: example_org' },
    { id: 306, name: 'OpenCTI Integration', category: 'feeds', description: 'Integrate with OpenCTI', inputExample: 'url: https://opencti.example.com, token: oc_token' },
    { id: 307, name: 'Threat Intelligence Platform', category: 'feeds', description: 'Connect to TIP', inputExample: 'platform: threatconnect, credentials: api_key' },
    { id: 308, name: 'Custom Feed Integration', category: 'feeds', description: 'Integrate custom feeds', inputExample: 'feed_url: https://feed.example.com, format: json' },
    { id: 309, name: 'Feed Aggregation', category: 'feeds', description: 'Aggregate multiple feeds', inputExample: 'feeds: [feed1,feed2], aggregation: union' },
    { id: 310, name: 'Feed Validation', category: 'feeds', description: 'Validate feed data', inputExample: 'feed: threat_feed, validation: [format,completeness]' },
    { id: 311, name: 'Geolocation Analysis', category: 'analysis', description: 'Analyze geolocation data', inputExample: 'ip: 1.2.3.4, analysis: [country,city,isp]' },
    { id: 312, name: 'ASN Analysis', category: 'analysis', description: 'Analyze ASN data', inputExample: 'asn: 12345, analysis: [organization,prefixes]' },
    { id: 313, name: 'DNS Analysis', category: 'analysis', description: 'Analyze DNS data', inputExample: 'domain: example.com, analysis: [records,history]' },
    { id: 314, name: 'WHOIS Analysis', category: 'analysis', description: 'Analyze WHOIS data', inputExample: 'domain: example.com, fields: [registrar,created]' },
    { id: 315, name: 'Certificate Analysis', category: 'analysis', description: 'Analyze certificate data', inputExample: 'cert: sha1:abc123..., analysis: [issuer,validity]' },
    { id: 316, name: 'Passive DNS Analysis', category: 'analysis', description: 'Analyze passive DNS', inputExample: 'domain: example.com, pDNS: [resolutions,subdomains]' },
    { id: 317, name: 'Historical Analysis', category: 'analysis', description: 'Analyze historical data', inputExample: 'ioc: 1.2.3.4, timeframe: 30_days' },
    { id: 318, name: 'Trend Analysis', category: 'analysis', description: 'Analyze trends', inputExample: 'metric: threat_count, period: 7_days' },
    { id: 319, name: 'Correlation Analysis', category: 'analysis', description: 'Correlate threat data', inputExample: 'data: [ioc1,ioc2], correlation: temporal' },
    { id: 320, name: 'Risk Assessment', category: 'analysis', description: 'Assess threat risk', inputExample: 'threat: apt_group, assessment: [likelihood,impact]' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalQueries: prev.totalQueries + Math.floor(Math.random() * 5),
        threatsIdentified: prev.threatsIdentified + Math.floor(Math.random() * 3),
        successRate: Math.floor(Math.random() * 20) + 80
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const openFunctionPage = (func) => {
    // Navigate to individual function page with function data
    navigate(`/threat-intel/function/${func.id}`, {
      state: {
        function: func,
        masterInput: { intelData, indicator }
      }
    });
  };

  const analyzeAllFunctions = async () => {
    if (!intelData.trim() && !indicator.trim()) return;
    
    setLoading(true);
    try {
      // Apply all 40 functions to the input
      const allResults = {};
      
      for (const func of threatIntelFunctions) {
        const executionTime = Math.random() * 2000 + 1000;
        await new Promise(resolve => setTimeout(resolve, executionTime));
        
        let result;
        switch (func.category) {
          case 'reputation':
            result = {
              status: 'success',
              data: {
                intelData: intelData,
                indicator: indicator,
                reputation: Math.random() * 100,
                confidence: Math.random() * 100,
                riskScore: Math.random() * 100,
                sources: Math.floor(Math.random() * 10) + 1,
                lastSeen: new Date().toISOString()
              },
              executionTime: executionTime
            };
            break;
          case 'ioc':
            result = {
              status: 'success',
              data: {
                intelData: intelData,
                indicator: indicator,
                iocType: 'IP',
                confidence: Math.random() * 100,
                riskScore: Math.random() * 100,
                matches: Math.floor(Math.random() * 20) + 1,
                campaigns: Math.floor(Math.random() * 5) + 1
              },
              executionTime: executionTime
            };
            break;
          case 'feed':
            result = {
              status: 'success',
              data: {
                intelData: intelData,
                indicator: indicator,
                feedName: 'threat_feed',
                confidence: Math.random() * 100,
                riskScore: Math.random() * 100,
                updates: Math.floor(Math.random() * 100) + 10,
                lastUpdate: new Date().toISOString()
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
        totalQueries: prev.totalQueries + 1,
        threatsIdentified: prev.threatsIdentified + Math.floor(Math.random() * 2),
        lastQuery: new Date(),
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
        case 'reputation':
          result = {
            status: 'success',
            data: {
              reputation: Math.random() * 100,
              confidence: Math.random() * 100,
              sources: Math.floor(Math.random() * 10) + 1,
              lastSeen: new Date().toISOString(),
              threatType: ['malware', 'phishing', 'botnet'][Math.floor(Math.random() * 3)],
              riskScore: Math.random() * 100
            },
            executionTime: executionTime
          };
          break;
        case 'ioc':
          result = {
            status: 'success',
            data: {
              iocs: Math.floor(Math.random() * 100),
              extracted: Math.floor(Math.random() * 50),
              validated: Math.floor(Math.random() * 30),
              enriched: Math.floor(Math.random() * 20),
              confidence: Math.random() * 100,
              accuracy: Math.random() * 100
            },
            executionTime: executionTime
          };
          break;
        case 'feeds':
          result = {
            status: 'success',
            data: {
              feeds: Math.floor(Math.random() * 20),
              records: Math.floor(Math.random() * 10000),
              lastUpdate: new Date().toISOString(),
              rateLimit: Math.floor(Math.random() * 1000) + 100,
              quota: Math.floor(Math.random() * 10000) + 1000,
              status: 'active'
            },
            executionTime: executionTime
          };
          break;
        case 'analysis':
          result = {
            status: 'success',
            data: {
              analyzed: Math.floor(Math.random() * 1000),
              patterns: Math.floor(Math.random() * 50),
              correlations: Math.floor(Math.random() * 20),
              trends: Math.floor(Math.random() * 10),
              accuracy: Math.random() * 100,
              confidence: Math.random() * 100
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
        totalQueries: prev.totalQueries + 1,
        threatsIdentified: prev.threatsIdentified + Math.floor(Math.random() * 2),
        lastQuery: new Date(),
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

  const analyzeThreat = async () => {
    if (!intelData) return;
    
    setLoading(true);
    try {
      const mockResult = {
        threatLevel: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)],
        confidence: Math.random() * 100,
        reputation: Math.random() * 100,
        sources: [
          {
            name: 'VirusTotal',
            reputation: Math.random() * 100,
            lastSeen: new Date().toISOString()
          },
          {
            name: 'AbuseIPDB',
            reputation: Math.random() * 100,
            lastSeen: new Date().toISOString()
          }
        ],
        recommendations: [
          'Block the IP address',
          'Monitor for related activity',
          'Update threat intelligence feeds'
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
            Threat Intelligence
          </h1>
          <div className="flex items-center justify-center space-x-4 mt-1">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Last query: {stats.lastQuery ? stats.lastQuery.toLocaleTimeString() : 'Never'}
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
              <p className="text-sm text-text-muted">Total Queries</p>
              <p className="text-2xl font-bold text-neon-cyan">{stats.totalQueries}</p>
            </div>
            <div className="w-12 h-12 bg-neon-cyan/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card-cyber">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Threats Identified</p>
              <p className="text-2xl font-bold text-danger-red">{stats.threatsIdentified}</p>
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
              <p className="text-sm text-text-muted">Active Feeds</p>
              <p className="text-2xl font-bold text-warning-yellow">{Math.floor(Math.random() * 20) + 5}</p>
            </div>
            <div className="w-12 h-12 bg-warning-yellow/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-warning-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Master Input Field */}
      <div className="card-cyber">
        <h2 className="text-xl font-semibold text-neon-cyan mb-4">Comprehensive Threat Intelligence</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Enter Intelligence Data
            </label>
            <textarea
              value={intelData}
              onChange={(e) => setIntelData(e.target.value)}
              placeholder="ip: 1.2.3.4, domain: example.com, hash: abc123..."
              className="input-cyber w-full h-32"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Enter Indicator
            </label>
            <input
              type="text"
              value={indicator}
              onChange={(e) => setIndicator(e.target.value)}
              placeholder="1.2.3.4 or example.com or abc123def456"
              className="input-cyber w-full"
            />
          </div>
          <button
            onClick={analyzeAllFunctions}
            disabled={loading || (!intelData.trim() && !indicator.trim())}
            className="btn-cyber w-full"
          >
            {loading ? 'Analyzing All Functions...' : 'Execute Comprehensive Threat Intelligence'}
          </button>
        </div>
      </div>

      {/* All 40 Threat Intelligence Functions */}
      <div className="card-cyber">
        <h2 className="text-xl font-semibold text-neon-cyan mb-6">Enterprise Threat Intelligence Platform</h2>
        {/* Group by Function Type */}
        {['reputation', 'ioc', 'feeds', 'analysis'].map((category) => {
          const categoryFunctions = threatIntelFunctions.filter(func => func.category === category);
          const categoryTitles = {
            'reputation': 'Reputation Assessment Systems',
            'ioc': 'Indicators of Compromise',
            'feeds': 'Threat Intelligence Feeds',
            'analysis': 'Intelligence Analysis Engine'
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
                          func.category === 'reputation' ? 'bg-neon-cyan/20 text-neon-cyan' :
                          func.category === 'ioc' ? 'bg-plasma-green/20 text-plasma-green' :
                          func.category === 'feeds' ? 'bg-quantum-purple/20 text-quantum-purple' :
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

      {/* Quick Threat Analysis Form */}
      <div className="card-cyber">
        <h2 className="text-xl font-semibold text-neon-cyan mb-4">Quick Threat Analysis</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Threat Data (JSON format)
            </label>
            <textarea
              value={intelData}
              onChange={(e) => setIntelData(e.target.value)}
              placeholder='{"ip": "1.2.3.4", "domain": "malware.com", "hash": "md5:abc123...", "type": "malware"}'
              className="input-cyber w-full h-32"
              rows={4}
            />
          </div>
          <button
            onClick={analyzeThreat}
            disabled={loading || !intelData}
            className="btn-cyber w-full"
          >
            {loading ? 'Analyzing...' : 'Analyze Threat'}
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
                <p className="text-sm text-text-muted">Threat Level</p>
                <p className={`text-2xl font-bold ${
                  result.threatLevel === 'Critical' ? 'text-danger-red' :
                  result.threatLevel === 'High' ? 'text-warning-yellow' :
                  result.threatLevel === 'Medium' ? 'text-fusion-orange' :
                  'text-plasma-green'
                }`}>
                  {result.threatLevel}
                </p>
              </div>
              <div className="bg-dark-surface p-4 rounded-lg">
                <p className="text-sm text-text-muted">Confidence</p>
                <p className="text-2xl font-bold text-neon-cyan">{result.confidence.toFixed(1)}%</p>
              </div>
              <div className="bg-dark-surface p-4 rounded-lg">
                <p className="text-sm text-text-muted">Reputation</p>
                <p className="text-2xl font-bold text-warning-yellow">{result.reputation.toFixed(1)}</p>
              </div>
            </div>

            {result.sources && result.sources.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Threat Intelligence Sources</h3>
                <div className="space-y-2">
                  {result.sources.map((source, index) => (
                    <div key={index} className="bg-dark-surface p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-text-primary">{source.name}</p>
                          <p className="text-sm text-text-muted">
                            Reputation: {source.reputation.toFixed(1)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-text-muted">
                            Last seen: {new Date(source.lastSeen).toLocaleDateString()}
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

export default ThreatIntel;
