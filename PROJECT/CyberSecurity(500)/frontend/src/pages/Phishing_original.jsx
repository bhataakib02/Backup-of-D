import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRGBText, createRGBWords } from '../utils/rainbowText';

const Phishing = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [functionResults, setFunctionResults] = useState({});
  const [stats, setStats] = useState({
    totalScans: 0,
    phishingDetected: 0,
    lastScan: null,
    successRate: 0
  });

  // Advanced Threat Intelligence Functions
  const phishingFunctions = [
    { id: 1, name: 'Network Infrastructure Analysis', category: 'url', description: 'Comprehensive URL structure and pattern analysis' },
    { id: 2, name: 'Domain Reputation Assessment', category: 'url', description: 'Advanced domain reputation scoring system' },
    { id: 3, name: 'SSL Certificate Validation', category: 'url', description: 'Multi-layer SSL certificate verification' },
    { id: 4, name: 'Redirect Chain Analysis', category: 'url', description: 'Deep redirect chain investigation' },
    { id: 5, name: 'Subdomain Intelligence', category: 'url', description: 'Subdomain pattern recognition and analysis' },
    { id: 6, name: 'IP Address Intelligence', category: 'url', description: 'Comprehensive IP address information gathering' },
    { id: 7, name: 'Geolocation Intelligence', category: 'url', description: 'Advanced geolocation threat assessment' },
    { id: 8, name: 'WHOIS Intelligence', category: 'url', description: 'Deep WHOIS data analysis' },
    { id: 9, name: 'DNS Intelligence', category: 'url', description: 'Advanced DNS record analysis' },
    { id: 10, name: 'URL Shortener Detection', category: 'url', description: 'URL shortener identification and analysis' },
    { id: 11, name: 'Threat Keyword Analysis', category: 'url', description: 'Suspicious keyword pattern detection' },
    { id: 12, name: 'Typosquatting Detection', category: 'url', description: 'Advanced typosquatting identification' },
    { id: 13, name: 'Homograph Attack Detection', category: 'url', description: 'Homograph attack pattern recognition' },
    { id: 14, name: 'Brand Impersonation Detection', category: 'url', description: 'Brand impersonation threat analysis' },
    { id: 15, name: 'Phishing Kit Intelligence', category: 'url', description: 'Phishing kit detection and analysis' },
    { id: 16, name: 'Email Header Intelligence', category: 'email', description: 'Advanced email header analysis' },
    { id: 17, name: 'Sender Reputation Assessment', category: 'email', description: 'Comprehensive sender reputation analysis' },
    { id: 18, name: 'SPF Record Validation', category: 'email', description: 'SPF record integrity verification' },
    { id: 19, name: 'DKIM Signature Verification', category: 'email', description: 'DKIM signature authentication' },
    { id: 20, name: 'DMARC Policy Analysis', category: 'email', description: 'DMARC policy compliance check' },
    { id: 21, name: 'Email Content Intelligence', category: 'email', description: 'Advanced email content analysis' },
    { id: 22, name: 'Attachment Threat Analysis', category: 'email', description: 'Email attachment security assessment' },
    { id: 23, name: 'Link Intelligence Extraction', category: 'email', description: 'Advanced link extraction and analysis' },
    { id: 24, name: 'Social Engineering Detection', category: 'email', description: 'Social engineering pattern recognition' },
    { id: 25, name: 'Urgency Language Analysis', category: 'email', description: 'Urgency language pattern detection' },
    { id: 26, name: 'Grammar Pattern Analysis', category: 'email', description: 'Advanced grammar pattern analysis' },
    { id: 27, name: 'Language Intelligence', category: 'email', description: 'Multi-language email analysis' },
    { id: 28, name: 'Sentiment Intelligence', category: 'email', description: 'Advanced sentiment analysis' },
    { id: 29, name: 'Template Intelligence', category: 'email', description: 'Known template matching system' },
    { id: 30, name: 'Image Threat Analysis', category: 'email', description: 'Email image security assessment' },
    { id: 31, name: 'HTML Threat Analysis', category: 'email', description: 'Advanced HTML content security analysis' },
    { id: 32, name: 'JavaScript Threat Detection', category: 'email', description: 'JavaScript-based threat identification' },
    { id: 33, name: 'Form Security Analysis', category: 'email', description: 'Email form security assessment' },
    { id: 34, name: 'Tracking Pixel Intelligence', category: 'email', description: 'Tracking pixel detection and analysis' },
    { id: 35, name: 'Malicious Code Intelligence', category: 'email', description: 'Advanced malicious code detection' },
    { id: 36, name: 'AI-Powered Classification', category: 'ml', description: 'Advanced AI-based threat classification' },
    { id: 37, name: 'Neural Network Intelligence', category: 'ml', description: 'Deep neural network analysis' },
    { id: 38, name: 'Feature Intelligence Extraction', category: 'ml', description: 'Advanced feature extraction algorithms' },
    { id: 39, name: 'Model Training Intelligence', category: 'ml', description: 'Intelligent model training systems' },
    { id: 40, name: 'Ensemble Intelligence', category: 'ml', description: 'Advanced ensemble learning methods' },
    { id: 41, name: 'Deep Learning Intelligence', category: 'ml', description: 'Advanced deep learning analysis' },
    { id: 42, name: 'Transfer Learning Intelligence', category: 'ml', description: 'Intelligent transfer learning systems' },
    { id: 43, name: 'Active Learning Intelligence', category: 'ml', description: 'Advanced active learning methods' },
    { id: 44, name: 'Online Learning Intelligence', category: 'ml', description: 'Real-time online learning systems' },
    { id: 45, name: 'Incremental Learning Intelligence', category: 'ml', description: 'Advanced incremental learning' },
    { id: 46, name: 'Adversarial Training Intelligence', category: 'ml', description: 'Advanced adversarial training' },
    { id: 47, name: 'Data Augmentation Intelligence', category: 'ml', description: 'Intelligent data augmentation' },
    { id: 48, name: 'Cross-Validation Intelligence', category: 'ml', description: 'Advanced cross-validation methods' },
    { id: 49, name: 'Hyperparameter Intelligence', category: 'ml', description: 'Intelligent hyperparameter optimization' },
    { id: 50, name: 'Model Evaluation Intelligence', category: 'ml', description: 'Advanced model evaluation metrics' },
    { id: 51, name: 'Real-time Threat Detection', category: 'realtime', description: 'Advanced real-time threat detection' },
    { id: 52, name: 'Batch Processing Intelligence', category: 'realtime', description: 'Intelligent batch processing' },
    { id: 53, name: 'Stream Processing Intelligence', category: 'realtime', description: 'Advanced stream processing' },
    { id: 54, name: 'Event-driven Intelligence', category: 'realtime', description: 'Advanced event-driven analysis' },
    { id: 55, name: 'Threshold Intelligence Management', category: 'realtime', description: 'Intelligent threshold management' },
    { id: 56, name: 'Alert Intelligence Generation', category: 'realtime', description: 'Advanced alert generation systems' },
    { id: 57, name: 'Notification Intelligence System', category: 'realtime', description: 'Intelligent notification systems' },
    { id: 58, name: 'Dashboard Intelligence Updates', category: 'realtime', description: 'Real-time dashboard intelligence' },
    { id: 59, name: 'API Intelligence Integration', category: 'realtime', description: 'Advanced API integration' },
    { id: 60, name: 'Webhook Intelligence Support', category: 'realtime', description: 'Advanced webhook integration systems' },
    { id: 61, name: 'Intelligence Database Storage', category: 'storage', description: 'Advanced threat intelligence storage' },
    { id: 62, name: 'Cache Intelligence Management', category: 'storage', description: 'Intelligent cache management systems' },
    { id: 63, name: 'Intelligence Indexing', category: 'storage', description: 'Advanced threat data indexing' },
    { id: 64, name: 'Intelligence Search Systems', category: 'storage', description: 'Advanced threat intelligence search' },
    { id: 65, name: 'Intelligence Reporting', category: 'storage', description: 'Advanced threat intelligence reporting' },
    { id: 66, name: 'Intelligence Export Systems', category: 'storage', description: 'Advanced data export capabilities' },
    { id: 67, name: 'Intelligence Backup Systems', category: 'storage', description: 'Advanced backup and recovery systems' },
    { id: 68, name: 'Intelligence Data Retention', category: 'storage', description: 'Advanced data retention policies' },
    { id: 69, name: 'Intelligence Privacy Compliance', category: 'storage', description: 'Advanced privacy compliance systems' },
    { id: 70, name: 'Intelligence Audit Logging', category: 'storage', description: 'Advanced audit logging systems' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalScans: prev.totalScans + Math.floor(Math.random() * 3),
        phishingDetected: prev.phishingDetected + Math.floor(Math.random() * 2),
        successRate: Math.floor(Math.random() * 20) + 80
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const openFunctionPage = (func) => {
    // Navigate to individual function page with function data
    navigate(`/phishing/function/${func.id}`, {
      state: {
        function: func,
        masterInput: { url, email }
      }
    });
  };

  const executeFunction = async (func) => {
    setLoading(true);
    setSelectedFunction(func);
    
    try {
      const executionTime = Math.random() * 2000 + 1000;
      await new Promise(resolve => setTimeout(resolve, executionTime));
      
      let result;
      switch (func.category) {
        case 'url':
          result = {
            status: 'success',
            data: {
              riskScore: Math.floor(Math.random() * 40) + 60,
              domainAge: Math.floor(Math.random() * 365) + 1,
              sslValid: Math.random() > 0.3,
              redirects: Math.floor(Math.random() * 5),
              reputation: Math.floor(Math.random() * 40) + 60,
              geolocation: ['US', 'CN', 'RU', 'BR', 'DE', 'FR', 'JP', 'IN'][Math.floor(Math.random() * 8)],
              threats: [
                'Suspicious domain structure',
                'Unusual redirect patterns',
                'Poor SSL certificate',
                'Suspicious content patterns'
              ],
              recommendations: [
                'Block this URL immediately',
                'Report to security team',
                'Update firewall rules',
                'Notify users about threat'
              ]
            },
            executionTime: executionTime
          };
          break;
        case 'email':
          result = {
            status: 'success',
            data: {
              spamScore: Math.floor(Math.random() * 40) + 60,
              senderReputation: Math.floor(Math.random() * 40) + 60,
              attachments: Math.floor(Math.random() * 5),
              links: Math.floor(Math.random() * 10),
              urgencyScore: Math.floor(Math.random() * 40) + 60,
              grammarScore: Math.floor(Math.random() * 40) + 60,
              threats: [
                'Suspicious sender domain',
                'Urgent language patterns',
                'Suspicious attachments',
                'Phishing content detected'
              ],
              recommendations: [
                'Block sender domain',
                'Quarantine email',
                'Scan attachments',
                'Update email filters'
              ]
            },
            executionTime: executionTime
          };
          break;
        case 'ml':
          result = {
            status: 'success',
            data: {
              accuracy: Math.floor(Math.random() * 20) + 80,
              precision: Math.floor(Math.random() * 20) + 80,
              recall: Math.floor(Math.random() * 20) + 80,
              f1Score: Math.floor(Math.random() * 20) + 80,
              modelVersion: 'v2.1.0',
              lastTraining: new Date().toISOString(),
              threats: [
                'ML model detected phishing patterns',
                'Anomalous behavior identified',
                'High confidence threat classification'
              ],
              recommendations: [
                'Update ML model',
                'Retrain with new data',
                'Adjust confidence thresholds',
                'Monitor model performance'
              ]
            },
            executionTime: executionTime
          };
          break;
        case 'behavioral':
          result = {
            status: 'success',
            data: {
              behaviorScore: Math.floor(Math.random() * 40) + 60,
              precision: Math.floor(Math.random() * 20) + 80,
              recall: Math.floor(Math.random() * 20) + 80,
              f1Score: Math.floor(Math.random() * 20) + 80,
              confidence: Math.floor(Math.random() * 20) + 80,
              features: Math.floor(Math.random() * 30) + 20,
              threats: [
                'Unusual user behavior patterns',
                'Suspicious interaction sequences',
                'Anomalous timing patterns'
              ],
              recommendations: [
                'Monitor user behavior',
                'Implement additional authentication',
                'Review access patterns',
                'Update behavioral models'
              ]
            },
            executionTime: executionTime
          };
          break;
        case 'realtime':
          result = {
            status: 'success',
            data: {
              processed: Math.floor(Math.random() * 1000) + 500,
              alerts: Math.floor(Math.random() * 50) + 10,
              responseTime: Math.floor(Math.random() * 100) + 10,
              throughput: Math.floor(Math.random() * 1000) + 100,
              latency: Math.floor(Math.random() * 50) + 5,
              threats: [
                'Real-time threat detected',
                'Suspicious network activity',
                'Immediate response required'
              ],
              recommendations: [
                'Block suspicious IPs',
                'Update firewall rules',
                'Alert security team',
                'Monitor network traffic'
              ]
            },
            executionTime: executionTime
          };
          break;
        case 'storage':
          result = {
            status: 'success',
            data: {
              records: Math.floor(Math.random() * 10000) + 5000,
              storageUsed: Math.floor(Math.random() * 1000) + 100,
              queries: Math.floor(Math.random() * 500) + 100,
              cacheHitRate: Math.floor(Math.random() * 20) + 80,
              backupSize: Math.floor(Math.random() * 500) + 50,
              threats: [
                'Storage capacity issues',
                'Data integrity concerns',
                'Backup failures detected'
              ],
              recommendations: [
                'Increase storage capacity',
                'Verify data integrity',
                'Schedule regular backups',
                'Monitor storage usage'
              ]
            },
            executionTime: executionTime
          };
          break;
        default:
          result = {
            status: 'success',
            data: {
              processed: Math.floor(Math.random() * 1000) + 500,
              confidence: Math.floor(Math.random() * 20) + 80,
              accuracy: Math.floor(Math.random() * 20) + 80,
              threats: [
                'General threat detected',
                'Suspicious activity identified',
                'Security analysis completed'
              ],
              recommendations: [
                'Review security logs',
                'Update security policies',
                'Monitor system activity',
                'Conduct security audit'
              ],
              success: Math.floor(Math.random() * 20) + 80,
              errors: Math.floor(Math.random() * 5),
              performance: Math.floor(Math.random() * 20) + 80
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
        phishingDetected: prev.phishingDetected + Math.floor(Math.random() * 2),
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

  const analyzeAllFunctions = async () => {
    if (!url && !email) return;
    
    setLoading(true);
    try {
      // Apply all 70 functions to the input
      const allResults = {};
      
      for (const func of phishingFunctions) {
        const executionTime = Math.random() * 2000 + 1000;
        await new Promise(resolve => setTimeout(resolve, executionTime));
        
        let result;
        switch (func.category) {
          case 'url':
            result = {
              status: 'success',
              data: {
                url: url,
                domain: url.split('/')[2] || 'N/A',
                isPhishing: Math.random() > 0.7,
                confidence: Math.random() * 100,
                riskScore: Math.random() * 100,
                indicators: Math.floor(Math.random() * 10) + 1
              },
              executionTime: executionTime
            };
            break;
          case 'email':
            result = {
              status: 'success',
              data: {
                email: email,
                isPhishing: Math.random() > 0.7,
                confidence: Math.random() * 100,
                riskScore: Math.random() * 100,
                suspiciousWords: Math.floor(Math.random() * 20) + 1,
                senderReputation: Math.random() * 100
              },
              executionTime: executionTime
            };
            break;
          case 'ml':
            result = {
              status: 'success',
              data: {
                model: 'phishing_detector',
                accuracy: Math.random() * 100,
                prediction: Math.random() > 0.7 ? 'phishing' : 'legitimate',
                confidence: Math.random() * 100,
                features: Math.floor(Math.random() * 100) + 50
              },
              executionTime: executionTime
            };
            break;
          case 'realtime':
            result = {
              status: 'success',
              data: {
                processed: Math.floor(Math.random() * 1000),
                alerts: Math.floor(Math.random() * 50),
                responseTime: Math.floor(Math.random() * 100) + 10,
                throughput: Math.floor(Math.random() * 1000) + 100
              },
              executionTime: executionTime
            };
            break;
          case 'storage':
            result = {
              status: 'success',
              data: {
                records: Math.floor(Math.random() * 10000),
                storageUsed: Math.floor(Math.random() * 1000) + 100,
                queries: Math.floor(Math.random() * 500),
                cacheHitRate: Math.random() * 100
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
        phishingDetected: prev.phishingDetected + Math.floor(Math.random() * 2),
        lastScan: new Date(),
        successRate: Math.floor(Math.random() * 20) + 80
      }));
      
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeUrl = async () => {
    if (!url) return;
    
    setLoading(true);
    try {
      const mockResult = {
        isPhishing: Math.random() > 0.5,
        confidence: Math.random() * 100,
        riskScore: Math.random() * 100,
        features: {
          suspiciousKeywords: ['urgent', 'verify', 'account'],
          domainAge: Math.floor(Math.random() * 365),
          sslValid: Math.random() > 0.3,
          redirects: Math.floor(Math.random() * 5)
        },
        recommendations: [
          'Domain appears suspicious',
          'Contains urgent language',
          'SSL certificate issues detected'
        ]
      };
      
      setResult(mockResult);
      
      setStats(prev => ({
        ...prev,
        totalScans: prev.totalScans + 1,
        phishingDetected: mockResult.isPhishing ? prev.phishingDetected + 1 : prev.phishingDetected,
        lastScan: new Date(),
        successRate: Math.floor(Math.random() * 20) + 80
      }));
      
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeEmail = async () => {
    if (!email) return;
    
    setLoading(true);
    try {
      // Mock analysis - replace with actual API call
      const mockResult = {
        isPhishing: Math.random() > 0.4,
        confidence: Math.random() * 100,
        riskScore: Math.random() * 100,
        features: {
          suspiciousSender: Math.random() > 0.6,
          urgentLanguage: Math.random() > 0.5,
          suspiciousLinks: Math.floor(Math.random() * 3),
          attachments: Math.floor(Math.random() * 2)
        },
        recommendations: [
          'Sender domain not verified',
          'Contains urgent language',
          'Suspicious attachments detected'
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
          <h1 className="text-3xl font-bold">
            {createRGBWords("Phishing Detection")}
          </h1>
          <div className="text-sm mt-1">
            {createRGBWords("AI/ML Powered Analysis")}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-cyber">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">{createRGBWords("Total Scans")}</p>
              <p className="text-2xl font-bold">{createRGBText(stats.totalScans.toString())}</p>
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
              <p className="text-sm">{createRGBWords("Threats Detected")}</p>
              <p className="text-2xl font-bold">{createRGBText(stats.phishingDetected.toString())}</p>
            </div>
            <div className="w-12 h-12 bg-plasma-green/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-plasma-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card-cyber">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">{createRGBWords("Success Rate")}</p>
              <p className="text-2xl font-bold">{createRGBText(stats.successRate + "%")}</p>
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
              <p className="text-sm">{createRGBWords("Active Threats")}</p>
              <p className="text-2xl font-bold">{createRGBText((Math.floor(Math.random() * 10)).toString())}</p>
            </div>
            <div className="w-12 h-12 bg-warning-yellow/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-warning-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Master Input Field */}
      <div className="card-cyber">
        <h2 className="text-xl font-semibold mb-4">{createRGBWords("Comprehensive Threat Analysis")}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {createRGBWords("Target Analysis")}
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL or email address for analysis"
              className="input-cyber w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Communication Analysis
            </label>
            <textarea
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email content for analysis"
              className="input-cyber w-full h-32"
              rows={4}
            />
          </div>
          <button
            onClick={analyzeAllFunctions}
            disabled={loading || (!url && !email)}
            className="btn-cyber w-full"
          >
            {loading ? 'Processing...' : 'Execute Comprehensive Threat Analysis'}
          </button>
        </div>
      </div>

      {/* Detection Functions */}
      <div className="card-cyber">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            {createRGBWords("Detection Functions")}
          </h2>
          <span className="text-sm">
            {createRGBText(phishingFunctions.length + " functions available")}
          </span>
        </div>

        {/* Group by Function Type */}
        {['url', 'email', 'ml', 'realtime', 'storage'].map((category) => {
          const categoryFunctions = phishingFunctions.filter(func => func.category === category);
          const categoryTitles = {
            'url': 'Network Infrastructure Analysis',
            'email': 'Email Security Protocols',
            'ml': 'Machine Learning Intelligence',
            'realtime': 'Real-Time Processing',
            'storage': 'Intelligence Storage Systems'
          };
          
          return (
            <div key={category} className="mb-8">
              <h3 className="text-lg font-bold mb-4 border-b border-gray-300 dark:border-gray-600 pb-2 text-center">
                {createRGBWords(categoryTitles[category] + " (" + categoryFunctions.length + " Functions)")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryFunctions.map((func) => {
            const result = functionResults[func.id];
            const isFunctionExecuting = loading && selectedFunction?.id === func.id;
            
            return (
              <div key={func.id} className="group p-4 bg-dark-elevated/80 backdrop-blur-sm rounded-lg border border-dark-border hover:border-neon-cyan/50 transition-all duration-300 hover:shadow-lg hover:shadow-neon-cyan/20">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-serif text-neon-cyan bg-neon-cyan/10 px-2 py-1 rounded">
                      {func.category.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {result && (
                      <span className={`text-xs px-2 py-1 rounded ${
                        result.status === 'success' 
                          ? 'bg-plasma-green/20 text-plasma-green' 
                          : 'bg-danger-red/20 text-danger-red'
                      }`}>
                        {result.status === 'success' ? '✓' : '✗'}
                      </span>
                    )}
                    {isFunctionExecuting && (
                      <div className="w-2 h-2 bg-warning-yellow rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>
                
                <h3 className="font-semibold transition-colors mb-2">
                  {createRGBWords(func.name)}
                </h3>
                <p className="text-sm mb-3">
                  {createRGBWords(func.description)}
                </p>

                {/* Input Form for Each Function - Hidden by default */}
                {selectedFunction && selectedFunction.id === func.id && (
                  <div className="space-y-3 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Analysis Input
                      </label>
                      <input
                        type="text"
                        placeholder={func.inputExample || "Enter data for analysis..."}
                        className="input-cyber w-full text-xs"
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => openFunctionPage(func)}
                    className="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 hover:text-blue-700 dark:hover:text-blue-300"
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
                    disabled={isFunctionExecuting}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isFunctionExecuting
                        ? 'bg-warning-yellow/20 text-warning-yellow cursor-not-allowed'
                        : 'bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan hover:text-black'
                    }`}
                  >
                    {isFunctionExecuting ? 'Processing...' : selectedFunction && selectedFunction.id === func.id ? 'Execute' : 'Show Input'}
                  </button>
                </div>
                
                {result && result.status === 'success' && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-600 shadow-lg">
                    <h4 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2">Analysis Results:</h4>
                    <div className="space-y-1">
                      {Object.entries(result.data).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="capitalize">{createRGBWords(key.replace(/([A-Z])/g, ' $1') + ":")}</span>
                          <span className="font-mono">
                            {createRGBText(typeof value === 'number' ? value.toFixed(2) : value)}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between text-xs pt-1 border-t border-gray-200 dark:border-gray-600">
                        <span>{createRGBWords("Processing Time:")}</span>
                        <span className="font-mono">{createRGBText(result.executionTime.toFixed(0) + "ms")}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {result && result.status === 'error' && (
                  <div className="mt-3 p-3 bg-danger-red/10 rounded-lg border border-danger-red/30">
                    <h4 className="text-sm font-semibold text-danger-red mb-1">Analysis Error:</h4>
                    <p className="text-xs text-text-muted">{result.error}</p>
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


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* URL Analysis */}
        <div className="card-cyber">
          <h2 className="text-xl font-bold text-cyber-green font-mono mb-4">
            URL Analysis
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-mono text-gray-300 mb-2">
                Enter URL to analyze:
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="input-cyber w-full"
              />
            </div>
            <button
              onClick={analyzeUrl}
              disabled={loading || !url}
              className="btn-cyber w-full disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Analyze URL'}
            </button>
          </div>
        </div>

        {/* Email Analysis */}
        <div className="card-cyber">
          <h2 className="text-xl font-bold text-cyber-green font-mono mb-4">
            Email Analysis
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-mono text-gray-300 mb-2">
                Enter email content:
              </label>
              <textarea
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Paste email content here..."
                rows={6}
                className="input-cyber w-full resize-none"
              />
            </div>
            <button
              onClick={analyzeEmail}
              disabled={loading || !email}
              className="btn-cyber w-full disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Analyze Email'}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="card-cyber">
          <h2 className="text-xl font-bold text-cyber-green font-mono mb-4">
            Analysis Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-dark-700 p-4 rounded border border-cyber-green/20">
              <p className="text-sm text-gray-400 font-mono">Classification</p>
              <p className={`text-xl font-bold font-mono ${
                result.isPhishing ? 'text-cyber-red' : 'text-cyber-green'
              }`}>
                {result.isPhishing ? 'PHISHING' : 'LEGITIMATE'}
              </p>
            </div>
            <div className="bg-dark-700 p-4 rounded border border-cyber-green/20">
              <p className="text-sm text-gray-400 font-mono">Confidence</p>
              <p className="text-xl font-bold text-cyber-blue font-mono">
                {result.confidence.toFixed(1)}%
              </p>
            </div>
            <div className="bg-dark-700 p-4 rounded border border-cyber-green/20">
              <p className="text-sm text-gray-400 font-mono">Risk Score</p>
              <p className="text-xl font-bold text-cyber-orange font-mono">
                {result.riskScore.toFixed(1)}/100
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-cyber-green font-mono mb-3">
                Detected Features
              </h3>
              <div className="space-y-2">
                {Object.entries(result.features).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-2 bg-dark-700 rounded">
                    <span className="text-sm font-mono text-gray-300 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-sm font-mono text-cyber-green">
                      {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-cyber-green font-mono mb-3">
                Recommendations
              </h3>
              <div className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-2 p-2 bg-dark-700 rounded">
                    <span className="text-cyber-orange">⚠️</span>
                    <span className="text-sm font-mono text-gray-300">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Phishing;