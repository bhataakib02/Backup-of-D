import React, { useState, useEffect } from 'react';
import { createProfessionalText, createSecondaryText, createMutedText, createAccentText } from '../utils/rainbowText';

const CryptoCrimeTracking = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisInput, setAnalysisInput] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);

  const cryptoFunctions = [
    // Cryptocurrency Crime Tracking (25 Functions)
    { id: 1, name: 'Bitcoin Transaction Analysis', category: 'bitcoin', description: 'Analyze Bitcoin blockchain transactions', status: 'active' },
    { id: 2, name: 'Ethereum Transaction Analysis', category: 'ethereum', description: 'Analyze Ethereum blockchain transactions', status: 'active' },
    { id: 3, name: 'Wallet Clustering', category: 'analysis', description: 'Cluster related cryptocurrency wallets', status: 'active' },
    { id: 4, name: 'Address Tagging', category: 'analysis', description: 'Tag addresses with known entities', status: 'active' },
    { id: 5, name: 'Flow Analysis', category: 'analysis', description: 'Analyze fund flows between addresses', status: 'active' },
    { id: 6, name: 'Mixing Service Detection', category: 'privacy', description: 'Detect cryptocurrency mixing services', status: 'active' },
    { id: 7, name: 'Tornado Cash Analysis', category: 'privacy', description: 'Analyze Tornado Cash transactions', status: 'active' },
    { id: 8, name: 'CoinJoin Detection', category: 'privacy', description: 'Detect CoinJoin transactions', status: 'active' },
    { id: 9, name: 'Ransomware Payment Tracking', category: 'ransomware', description: 'Track ransomware payments', status: 'active' },
    { id: 10, name: 'Dark Web Market Analysis', category: 'darkweb', description: 'Analyze dark web market transactions', status: 'active' },
    { id: 11, name: 'Exchange Monitoring', category: 'exchanges', description: 'Monitor cryptocurrency exchanges', status: 'active' },
    { id: 12, name: 'KYC/AML Compliance', category: 'compliance', description: 'Check KYC/AML compliance', status: 'active' },
    { id: 13, name: 'Suspicious Activity Detection', category: 'suspicious', description: 'Detect suspicious transaction patterns', status: 'active' },
    { id: 14, name: 'Ponzi Scheme Detection', category: 'fraud', description: 'Detect Ponzi schemes', status: 'active' },
    { id: 15, name: 'Pump and Dump Detection', category: 'fraud', description: 'Detect pump and dump schemes', status: 'active' },
    { id: 16, name: 'ICO Scam Detection', category: 'fraud', description: 'Detect ICO scams', status: 'active' },
    { id: 17, name: 'DeFi Protocol Analysis', category: 'defi', description: 'Analyze DeFi protocol transactions', status: 'active' },
    { id: 18, name: 'Smart Contract Analysis', category: 'defi', description: 'Analyze smart contract interactions', status: 'active' },
    { id: 19, name: 'Yield Farming Monitoring', category: 'defi', description: 'Monitor yield farming activities', status: 'active' },
    { id: 20, name: 'Flash Loan Analysis', category: 'defi', description: 'Analyze flash loan attacks', status: 'active' },
    { id: 21, name: 'Cross-Chain Analysis', category: 'crosschain', description: 'Analyze cross-chain transactions', status: 'active' },
    { id: 22, name: 'Bridge Monitoring', category: 'crosschain', description: 'Monitor bridge transactions', status: 'active' },
    { id: 23, name: 'NFT Fraud Detection', category: 'nft', description: 'Detect NFT fraud and scams', status: 'active' },
    { id: 24, name: 'Wash Trading Detection', category: 'nft', description: 'Detect wash trading in NFTs', status: 'active' },
    { id: 25, name: 'Metaverse Crime Tracking', category: 'metaverse', description: 'Track crimes in metaverse environments', status: 'active' }
  ];

  const categoryTitles = {
    bitcoin: 'Bitcoin Analysis',
    ethereum: 'Ethereum Analysis',
    analysis: 'Blockchain Analysis',
    privacy: 'Privacy Coin Analysis',
    ransomware: 'Ransomware Tracking',
    darkweb: 'Dark Web Markets',
    exchanges: 'Exchange Monitoring',
    compliance: 'Compliance & AML',
    suspicious: 'Suspicious Activity',
    fraud: 'Fraud Detection',
    defi: 'DeFi Analysis',
    crosschain: 'Cross-Chain Analysis',
    nft: 'NFT Analysis',
    metaverse: 'Metaverse Security'
  };

  useEffect(() => {
    // Simulate loading transactions
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTransactions([
        {
          id: 1,
          type: 'Ransomware Payment',
          amount: '12.5 BTC',
          value: '$450,000',
          from: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
          to: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          timestamp: new Date().toISOString(),
          confidence: 95,
          threatActor: 'LockBit 3.0',
          description: 'Ransomware payment to known LockBit wallet'
        },
        {
          id: 2,
          type: 'Dark Web Market',
          amount: '2.3 ETH',
          value: '$4,600',
          from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          to: '0x8ba1f109551bD432803012645Hac136c',
          timestamp: new Date().toISOString(),
          confidence: 88,
          threatActor: 'Unknown',
          description: 'Transaction to known dark web market'
        },
        {
          id: 3,
          type: 'Mixing Service',
          amount: '5.7 BTC',
          value: '$205,000',
          from: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
          to: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
          timestamp: new Date().toISOString(),
          confidence: 92,
          threatActor: 'Privacy Seeker',
          description: 'Funds sent through mixing service'
        }
      ]);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-500';
    if (confidence >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Ransomware Payment': return 'text-red-500';
      case 'Dark Web Market': return 'text-orange-500';
      case 'Mixing Service': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const handleAnalyzeTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setShowAnalysis(true);
  };

  const closeAnalysis = () => {
    setShowAnalysis(false);
    setSelectedTransaction(null);
    setAnalysisResults(null);
  };

  const executeCryptoAnalysis = async () => {
    if (!analysisInput.trim()) return;
    
    setIsAnalyzing(true);
    try {
      // Simulate crypto analysis processing
      await new Promise(resolve => setTimeout(resolve, 3500));
      
      const mockResults = {
        riskLevel: Math.random() > 0.3 ? 'High' : Math.random() > 0.1 ? 'Medium' : 'Low',
        confidence: Math.floor(Math.random() * 25) + 75,
        totalTransactions: Math.floor(Math.random() * 500) + 100,
        suspiciousTransactions: Math.floor(Math.random() * 50) + 10,
        totalValue: Math.floor(Math.random() * 10000000) + 1000000,
        currencies: ['Bitcoin', 'Ethereum', 'Monero', 'Litecoin', 'Bitcoin Cash'],
        exchanges: ['Binance', 'Coinbase', 'Kraken', 'Huobi', 'KuCoin'],
        mixingServices: ['Tornado Cash', 'CoinJoin', 'Wasabi Wallet', 'Samourai Wallet'],
        ransomwareGroups: [
          'LockBit 3.0',
          'BlackCat/ALPHV',
          'REvil/Sodinokibi',
          'Conti Group',
          'DarkSide'
        ],
        darkWebMarkets: [
          'AlphaBay 2.0',
          'DarkMarket',
          'White House Market',
          'Monopoly Market'
        ],
        walletClusters: Math.floor(Math.random() * 20) + 5,
        addressTags: Math.floor(Math.random() * 100) + 50,
        geolocation: ['Russia', 'China', 'North Korea', 'Iran', 'Eastern Europe', 'Unknown'],
        indicators: [
          'High-frequency micro-transactions',
          'Cross-chain bridge usage',
          'Privacy coin conversions',
          'Mixing service interactions',
          'Exchange hot wallet deposits'
        ],
        recommendations: [
          'Report suspicious addresses to authorities',
          'Implement enhanced transaction monitoring',
          'Deploy blockchain analytics tools',
          'Strengthen KYC/AML procedures',
          'Monitor cross-chain activities'
        ],
        timeline: {
          firstTransaction: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
          lastTransaction: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
          analysis: new Date().toISOString()
        },
        blockchainData: {
          bitcoinBlocks: Math.floor(Math.random() * 1000) + 500,
          ethereumBlocks: Math.floor(Math.random() * 2000) + 1000,
          confirmations: Math.floor(Math.random() * 100) + 6
        }
      };
      
      setAnalysisResults(mockResults);
    } catch (error) {
      console.error('Crypto analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateReport = async () => {
    if (!selectedTransaction) return;
    
    setIsAnalyzing(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const report = {
        id: `CCT-${Date.now()}`,
        title: `Cryptocurrency Crime Analysis Report: ${selectedTransaction.name}`,
        generated: new Date().toISOString(),
        classification: 'CONFIDENTIAL - LAW ENFORCEMENT SENSITIVE',
        summary: `Comprehensive blockchain analysis of ${selectedTransaction.name} reveals significant cryptocurrency crime patterns and money laundering activities requiring immediate investigation.`,
        executiveSummary: 'Advanced blockchain forensics has identified high-risk cryptocurrency transactions linked to criminal activities including ransomware, dark web markets, and money laundering operations.',
        keyFindings: [
          'Multiple ransomware payment addresses identified',
          'Significant mixing service usage detected',
          'Cross-chain laundering patterns observed',
          'Dark web marketplace transaction flows confirmed',
          'High-value suspicious transaction clusters found'
        ],
        transactionAnalysis: {
          totalAnalyzed: Math.floor(Math.random() * 1000) + 500,
          suspiciousCount: Math.floor(Math.random() * 100) + 50,
          totalValue: Math.floor(Math.random() * 50000000) + 10000000,
          currencies: ['BTC', 'ETH', 'XMR', 'LTC', 'BCH'],
          timespan: '90 days'
        },
        threatActorProfiles: [
          {
            name: 'LockBit 3.0',
            activity: 'Ransomware operations',
            wallets: Math.floor(Math.random() * 20) + 5,
            totalValue: '$2.5M',
            threat: 'Critical',
            lastSeen: '2024-01-10'
          },
          {
            name: 'DarkSide',
            activity: 'Ransomware-as-a-Service',
            wallets: Math.floor(Math.random() * 15) + 3,
            totalValue: '$1.8M',
            threat: 'High',
            lastSeen: '2024-01-08'
          }
        ],
        recommendations: [
          'Freeze identified suspicious wallet addresses',
          'Coordinate with international law enforcement',
          'Implement enhanced blockchain monitoring',
          'Deploy advanced mixing detection algorithms',
          'Establish cryptocurrency crime task force'
        ],
        technicalDetails: {
          analysisMethod: 'Advanced Blockchain Forensics',
          dataSource: 'Multi-Blockchain Intelligence Network',
          confidence: Math.floor(Math.random() * 15) + 85,
          riskScore: Math.floor(Math.random() * 25) + 75,
          walletsAnalyzed: Math.floor(Math.random() * 500) + 200
        },
        iocs: [
          'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy'
        ]
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
    if (!selectedTransaction) return;
    
    try {
      const exportData = {
        transaction: selectedTransaction,
        analysisResults: analysisResults,
        timestamp: new Date().toISOString(),
        format: 'JSON',
        version: '2.0',
        classification: 'CONFIDENTIAL',
        source: 'Cryptocurrency Crime Tracking System'
      };
      
      // Create downloadable file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `crypto-crime-analysis-${selectedTransaction.id}-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Show success message
      alert('Cryptocurrency crime data exported successfully!');
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
            <p className="cyber-text-muted mt-4">Loading cryptocurrency transactions...</p>
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
            Cryptocurrency Crime Tracking
          </h1>
          <p className="cyber-text-secondary">
            Advanced blockchain analysis and cryptocurrency crime detection
          </p>
        </div>

        {/* Master Input */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={analysisInput}
              onChange={(e) => setAnalysisInput(e.target.value)}
              placeholder="Enter wallet address, transaction hash, or cryptocurrency for analysis..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button 
              onClick={executeCryptoAnalysis}
              disabled={isAnalyzing || !analysisInput.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors duration-200"
            >
              {isAnalyzing ? 'Analyzing...' : 'Execute Crypto Analysis'}
            </button>
          </div>
          
          {/* Analysis Results */}
          {analysisResults && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold cyber-text-primary mb-3">Cryptocurrency Analysis Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-sm cyber-text-muted">Risk Level</p>
                  <p className={`text-xl font-bold ${
                    analysisResults.riskLevel === 'High' ? 'text-red-500' :
                    analysisResults.riskLevel === 'Medium' ? 'text-orange-500' : 'text-yellow-500'
                  }`}>
                    {analysisResults.riskLevel}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm cyber-text-muted">Confidence</p>
                  <p className="text-xl font-bold text-blue-500">{analysisResults.confidence}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm cyber-text-muted">Total Value</p>
                  <p className="text-xl font-bold text-green-500">${analysisResults.totalValue.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm cyber-text-muted">Suspicious TXs</p>
                  <p className="text-xl font-bold text-red-500">{analysisResults.suspiciousTransactions}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold cyber-text-primary mb-2">Ransomware Groups</h4>
                  <ul className="text-sm cyber-text-secondary space-y-1">
                    {analysisResults.ransomwareGroups.slice(0, 3).map((group, index) => (
                      <li key={index}>• {group}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold cyber-text-primary mb-2">Mixing Services</h4>
                  <ul className="text-sm cyber-text-secondary space-y-1">
                    {analysisResults.mixingServices.slice(0, 3).map((service, index) => (
                      <li key={index}>• {service}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-semibold cyber-text-primary mb-2">Blockchain Data</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="cyber-text-muted">Bitcoin Blocks</p>
                    <p className="font-bold text-orange-500">{analysisResults.blockchainData.bitcoinBlocks}</p>
                  </div>
                  <div>
                    <p className="cyber-text-muted">Ethereum Blocks</p>
                    <p className="font-bold text-blue-500">{analysisResults.blockchainData.ethereumBlocks}</p>
                  </div>
                  <div>
                    <p className="cyber-text-muted">Wallet Clusters</p>
                    <p className="font-bold text-purple-500">{analysisResults.walletClusters}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Function Categories */}
        {Object.entries(categoryTitles).map(([category, title]) => {
          const categoryFunctions = cryptoFunctions.filter(func => func.category === category);
          
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
                    onClick={() => handleAnalyzeTransaction(func)}
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
                        Analyze
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Live Transaction Feed */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold cyber-text-primary mb-4 text-center">
            Live Cryptocurrency Crime Feed
          </h2>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-semibold ${getTypeColor(transaction.type)}`}>
                    {transaction.type}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-semibold">
                      {transaction.amount}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-semibold">
                      {transaction.value}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getConfidenceColor(transaction.confidence)}`}>
                      {transaction.confidence}% Confidence
                    </span>
                  </div>
                </div>
                <p className="text-sm cyber-text-secondary mb-2">
                  {transaction.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs cyber-text-muted mb-2">
                  <div>
                    <span className="font-semibold">From:</span> {transaction.from.substring(0, 20)}...
                  </div>
                  <div>
                    <span className="font-semibold">To:</span> {transaction.to.substring(0, 20)}...
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs cyber-text-muted">
                  <span>Threat Actor: {transaction.threatActor}</span>
                  <span>{new Date(transaction.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis Modal */}
        {showAnalysis && selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold cyber-text-primary">
                    {selectedTransaction.name} Analysis
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
                      {selectedTransaction.description}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Status</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      selectedTransaction.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {selectedTransaction.status}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Category</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
                      {selectedTransaction.category.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={generateReport}
                    disabled={isAnalyzing}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    {isAnalyzing ? 'Generating...' : 'Generate Report'}
                  </button>
                  <button 
                    onClick={exportData}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                  >
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

        {/* Report Modal */}
        {showReport && reportData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold cyber-text-primary">
                      {reportData.title}
                    </h2>
                    <p className="text-sm text-red-600 font-semibold">{reportData.classification}</p>
                  </div>
                  <button
                    onClick={() => setShowReport(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold cyber-text-primary mb-2">Report ID</h3>
                      <p className="text-sm cyber-text-secondary font-mono">{reportData.id}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold cyber-text-primary mb-2">Generated</h3>
                      <p className="text-sm cyber-text-secondary">
                        {new Date(reportData.generated).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Executive Summary</h3>
                    <p className="text-sm cyber-text-secondary bg-gray-50 dark:bg-gray-700 p-3 rounded">
                      {reportData.executiveSummary}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Transaction Analysis Overview</h3>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                        <div>
                          <p className="text-xs cyber-text-muted">Total Analyzed</p>
                          <p className="text-lg font-bold text-blue-500">{reportData.transactionAnalysis.totalAnalyzed}</p>
                        </div>
                        <div>
                          <p className="text-xs cyber-text-muted">Suspicious</p>
                          <p className="text-lg font-bold text-red-500">{reportData.transactionAnalysis.suspiciousCount}</p>
                        </div>
                        <div>
                          <p className="text-xs cyber-text-muted">Total Value</p>
                          <p className="text-lg font-bold text-green-500">${(reportData.transactionAnalysis.totalValue / 1000000).toFixed(1)}M</p>
                        </div>
                        <div>
                          <p className="text-xs cyber-text-muted">Currencies</p>
                          <p className="text-lg font-bold text-purple-500">{reportData.transactionAnalysis.currencies.length}</p>
                        </div>
                        <div>
                          <p className="text-xs cyber-text-muted">Timespan</p>
                          <p className="text-lg font-bold text-orange-500">{reportData.transactionAnalysis.timespan}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Key Findings</h3>
                    <ul className="text-sm cyber-text-secondary space-y-2">
                      {reportData.keyFindings.map((finding, index) => (
                        <li key={index} className="flex items-start bg-red-50 dark:bg-red-900/20 p-2 rounded">
                          <span className="text-red-500 mr-2 font-bold">⚠</span>
                          {finding}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Threat Actor Profiles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {reportData.threatActorProfiles.map((actor, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold cyber-text-primary text-sm">{actor.name}</h4>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              actor.threat === 'Critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                              'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                            }`}>
                              {actor.threat}
                            </span>
                          </div>
                          <p className="text-xs cyber-text-secondary">{actor.activity}</p>
                          <div className="flex justify-between text-xs cyber-text-muted mt-1">
                            <span>Wallets: {actor.wallets}</span>
                            <span>Value: {actor.totalValue}</span>
                            <span>Last seen: {actor.lastSeen}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Cryptocurrency Addresses (IOCs)</h3>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                      <ul className="text-sm cyber-text-secondary space-y-1 font-mono">
                        {reportData.iocs.map((ioc, index) => (
                          <li key={index} className="break-all">• {ioc}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Recommendations</h3>
                    <ul className="text-sm cyber-text-secondary space-y-2">
                      {reportData.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start bg-green-50 dark:bg-green-900/20 p-2 rounded">
                          <span className="text-green-500 mr-2 font-bold">✓</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Technical Analysis Details</h3>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs cyber-text-muted">Analysis Method</p>
                          <p className="text-sm cyber-text-primary font-semibold">
                            {reportData.technicalDetails.analysisMethod}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs cyber-text-muted">Data Source</p>
                          <p className="text-sm cyber-text-primary font-semibold">
                            {reportData.technicalDetails.dataSource}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs cyber-text-muted">Wallets Analyzed</p>
                          <p className="text-sm cyber-text-primary font-semibold">
                            {reportData.technicalDetails.walletsAnalyzed}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs cyber-text-muted">Confidence Level</p>
                          <p className="text-sm cyber-text-primary font-semibold">
                            {reportData.technicalDetails.confidence}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs cyber-text-muted">Risk Score</p>
                          <p className="text-sm cyber-text-primary font-semibold">
                            {reportData.technicalDetails.riskScore}/100
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={() => {
                      const reportStr = JSON.stringify(reportData, null, 2);
                      const reportBlob = new Blob([reportStr], { type: 'application/json' });
                      const url = URL.createObjectURL(reportBlob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `${reportData.id}.json`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Download Report
                  </button>
                  <button 
                    onClick={() => {
                      const printWindow = window.open('', '_blank');
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>${reportData.title}</title>
                            <style>
                              body { font-family: Arial, sans-serif; margin: 20px; }
                              .classification { color: red; font-weight: bold; }
                              .finding { background: #ffebee; padding: 8px; margin: 4px 0; border-left: 4px solid #f44336; }
                              .recommendation { background: #e8f5e8; padding: 8px; margin: 4px 0; border-left: 4px solid #4caf50; }
                              .ioc { font-family: monospace; background: #f5f5f5; padding: 2px 4px; }
                            </style>
                          </head>
                          <body>
                            <h1>${reportData.title}</h1>
                            <p class="classification">${reportData.classification}</p>
                            <p><strong>Generated:</strong> ${new Date(reportData.generated).toLocaleString()}</p>
                            <h2>Executive Summary</h2>
                            <p>${reportData.executiveSummary}</p>
                            <h2>Key Findings</h2>
                            ${reportData.keyFindings.map(f => `<div class="finding">⚠ ${f}</div>`).join('')}
                            <h2>Threat Actor Profiles</h2>
                            ${reportData.threatActorProfiles.map(a => `<div><strong>${a.name}</strong> (${a.threat}): ${a.activity} - ${a.totalValue}</div>`).join('')}
                            <h2>Cryptocurrency Addresses</h2>
                            ${reportData.iocs.map(i => `<div class="ioc">${i}</div>`).join('')}
                            <h2>Recommendations</h2>
                            ${reportData.recommendations.map(r => `<div class="recommendation">✓ ${r}</div>`).join('')}
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                      printWindow.print();
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Print Report
                  </button>
                  <button
                    onClick={() => setShowReport(false)}
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

export default CryptoCrimeTracking;

