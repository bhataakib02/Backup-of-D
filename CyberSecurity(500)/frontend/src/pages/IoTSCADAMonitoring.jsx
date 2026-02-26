import React, { useState, useEffect } from 'react';
import { createProfessionalText, createSecondaryText, createMutedText, createAccentText } from '../utils/rainbowText';

const IoTSCADAMonitoring = () => {
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisInput, setAnalysisInput] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);

  const iotFunctions = [
    // IoT/SCADA Monitoring (40 Functions)
    { id: 1, name: 'Device Discovery', category: 'discovery', description: 'Discover IoT and SCADA devices', status: 'active' },
    { id: 2, name: 'Protocol Analysis', category: 'protocols', description: 'Analyze industrial protocols', status: 'active' },
    { id: 3, name: 'Modbus Monitoring', category: 'modbus', description: 'Monitor Modbus communications', status: 'active' },
    { id: 4, name: 'DNP3 Analysis', category: 'dnp3', description: 'Analyze DNP3 protocol', status: 'active' },
    { id: 5, name: 'IEC 61850 Monitoring', category: 'iec61850', description: 'Monitor IEC 61850 communications', status: 'active' },
    { id: 6, name: 'OPC UA Analysis', category: 'opcua', description: 'Analyze OPC UA communications', status: 'active' },
    { id: 7, name: 'EtherNet/IP Monitoring', category: 'ethernetip', description: 'Monitor EtherNet/IP traffic', status: 'active' },
    { id: 8, name: 'Profinet Analysis', category: 'profinet', description: 'Analyze Profinet communications', status: 'active' },
    { id: 9, name: 'BACnet Monitoring', category: 'bacnet', description: 'Monitor BACnet building automation', status: 'active' },
    { id: 10, name: 'MQTT Analysis', category: 'mqtt', description: 'Analyze MQTT IoT communications', status: 'active' },
    { id: 11, name: 'CoAP Monitoring', category: 'coap', description: 'Monitor CoAP IoT protocol', status: 'active' },
    { id: 12, name: 'AMQP Analysis', category: 'amqp', description: 'Analyze AMQP messaging', status: 'active' },
    { id: 13, name: 'Device Fingerprinting', category: 'fingerprinting', description: 'Fingerprint IoT devices', status: 'active' },
    { id: 14, name: 'Vulnerability Scanning', category: 'vulnerabilities', description: 'Scan for IoT vulnerabilities', status: 'active' },
    { id: 15, name: 'Firmware Analysis', category: 'firmware', description: 'Analyze device firmware', status: 'active' },
    { id: 16, name: 'Configuration Monitoring', category: 'config', description: 'Monitor device configurations', status: 'active' },
    { id: 17, name: 'Network Traffic Analysis', category: 'traffic', description: 'Analyze network traffic patterns', status: 'active' },
    { id: 18, name: 'Anomaly Detection', category: 'anomaly', description: 'Detect anomalous behavior', status: 'active' },
    { id: 19, name: 'Intrusion Detection', category: 'intrusion', description: 'Detect intrusions in IoT networks', status: 'active' },
    { id: 20, name: 'Malware Detection', category: 'malware', description: 'Detect IoT malware', status: 'active' },
    { id: 21, name: 'Botnet Detection', category: 'botnet', description: 'Detect IoT botnets', status: 'active' },
    { id: 22, name: 'DDoS Protection', category: 'ddos', description: 'Protect against DDoS attacks', status: 'active' },
    { id: 23, name: 'Data Integrity Monitoring', category: 'integrity', description: 'Monitor data integrity', status: 'active' },
    { id: 24, name: 'Access Control Monitoring', category: 'access', description: 'Monitor access controls', status: 'active' },
    { id: 25, name: 'Authentication Analysis', category: 'auth', description: 'Analyze authentication mechanisms', status: 'active' },
    { id: 26, name: 'Encryption Monitoring', category: 'encryption', description: 'Monitor encryption usage', status: 'active' },
    { id: 27, name: 'Key Management', category: 'keys', description: 'Manage cryptographic keys', status: 'active' },
    { id: 28, name: 'Certificate Management', category: 'certificates', description: 'Manage device certificates', status: 'active' },
    { id: 29, name: 'Compliance Monitoring', category: 'compliance', description: 'Monitor compliance standards', status: 'active' },
    { id: 30, name: 'Risk Assessment', category: 'risk', description: 'Assess IoT security risks', status: 'active' },
    { id: 31, name: 'Threat Intelligence', category: 'intelligence', description: 'IoT threat intelligence', status: 'active' },
    { id: 32, name: 'Incident Response', category: 'incidents', description: 'Respond to IoT incidents', status: 'active' },
    { id: 33, name: 'Forensic Analysis', category: 'forensics', description: 'IoT forensic analysis', status: 'active' },
    { id: 34, name: 'Asset Management', category: 'assets', description: 'Manage IoT assets', status: 'active' },
    { id: 35, name: 'Performance Monitoring', category: 'performance', description: 'Monitor device performance', status: 'active' },
    { id: 36, name: 'Health Monitoring', category: 'health', description: 'Monitor device health', status: 'active' },
    { id: 37, name: 'Predictive Maintenance', category: 'maintenance', description: 'Predictive maintenance alerts', status: 'active' },
    { id: 38, name: 'Energy Monitoring', category: 'energy', description: 'Monitor energy consumption', status: 'active' },
    { id: 39, name: 'Environmental Monitoring', category: 'environment', description: 'Monitor environmental conditions', status: 'active' },
    { id: 40, name: 'Safety Systems', category: 'safety', description: 'Monitor safety systems', status: 'active' }
  ];

  const categoryTitles = {
    discovery: 'Device Discovery',
    protocols: 'Protocol Analysis',
    modbus: 'Modbus Monitoring',
    dnp3: 'DNP3 Analysis',
    iec61850: 'IEC 61850',
    opcua: 'OPC UA Analysis',
    ethernetip: 'EtherNet/IP',
    profinet: 'Profinet Analysis',
    bacnet: 'BACnet Monitoring',
    mqtt: 'MQTT Analysis',
    coap: 'CoAP Monitoring',
    amqp: 'AMQP Analysis',
    fingerprinting: 'Device Fingerprinting',
    vulnerabilities: 'Vulnerability Scanning',
    firmware: 'Firmware Analysis',
    config: 'Configuration Monitoring',
    traffic: 'Network Traffic',
    anomaly: 'Anomaly Detection',
    intrusion: 'Intrusion Detection',
    malware: 'Malware Detection',
    botnet: 'Botnet Detection',
    ddos: 'DDoS Protection',
    integrity: 'Data Integrity',
    access: 'Access Control',
    auth: 'Authentication',
    encryption: 'Encryption',
    keys: 'Key Management',
    certificates: 'Certificate Management',
    compliance: 'Compliance',
    risk: 'Risk Assessment',
    intelligence: 'Threat Intelligence',
    incidents: 'Incident Response',
    forensics: 'Forensics',
    assets: 'Asset Management',
    performance: 'Performance',
    health: 'Health Monitoring',
    maintenance: 'Predictive Maintenance',
    energy: 'Energy Monitoring',
    environment: 'Environmental',
    safety: 'Safety Systems'
  };

  useEffect(() => {
    // Simulate loading devices
    const timer = setTimeout(() => {
      setIsLoading(false);
      setDevices([
        {
          id: 1,
          name: 'PLC-001',
          type: 'Programmable Logic Controller',
          protocol: 'Modbus TCP',
          ipAddress: '192.168.1.100',
          status: 'Online',
          riskLevel: 'Medium',
          vulnerabilities: 3,
          lastSeen: new Date().toISOString(),
          description: 'Industrial PLC controlling production line',
          indicators: ['Unusual network traffic', 'Configuration changes', 'Protocol anomalies'],
          affectedSystems: ['Production Line', 'SCADA Network'],
          detection: 'Protocol analysis, anomaly detection'
        },
        {
          id: 2,
          name: 'HMI-002',
          type: 'Human Machine Interface',
          protocol: 'OPC UA',
          ipAddress: '192.168.1.101',
          status: 'Online',
          riskLevel: 'High',
          vulnerabilities: 5,
          lastSeen: new Date().toISOString(),
          description: 'HMI for monitoring industrial processes',
          indicators: ['Unauthorized access attempts', 'Suspicious commands', 'Data exfiltration'],
          affectedSystems: ['Control System', 'Monitoring Network'],
          detection: 'Access monitoring, command analysis'
        },
        {
          id: 3,
          name: 'Sensor-003',
          type: 'IoT Sensor',
          protocol: 'MQTT',
          ipAddress: '192.168.1.102',
          status: 'Offline',
          riskLevel: 'Low',
          vulnerabilities: 1,
          lastSeen: new Date(Date.now() - 3600000).toISOString(),
          description: 'Temperature sensor for environmental monitoring',
          indicators: ['Device offline', 'Communication timeout', 'Data anomalies'],
          affectedSystems: ['Environmental System', 'IoT Network'],
          detection: 'Device monitoring, communication analysis'
        }
      ]);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'High': return 'text-red-500';
      case 'Medium': return 'text-orange-500';
      case 'Low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Online': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Offline': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getProtocolColor = (protocol) => {
    const colors = {
      'Modbus TCP': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'OPC UA': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'MQTT': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'DNP3': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'IEC 61850': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    };
    return colors[protocol] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  const handleAnalyzeDevice = (device) => {
    setSelectedDevice(device);
    setShowAnalysis(true);
  };

  const closeAnalysis = () => {
    setShowAnalysis(false);
    setSelectedDevice(null);
    setAnalysisResults(null);
  };

  const executeIoTAnalysis = async () => {
    if (!analysisInput.trim()) return;
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      const mockResults = {
        securityLevel: Math.random() > 0.5 ? 'Medium' : 'High',
        confidence: Math.floor(Math.random() * 15) + 85,
        devicesScanned: Math.floor(Math.random() * 50) + 20,
        vulnerabilities: Math.floor(Math.random() * 15) + 5,
        protocols: ['Modbus', 'DNP3', 'OPC UA', 'MQTT'],
        anomalies: Math.floor(Math.random() * 8) + 2,
        recommendations: ['Update device firmware', 'Implement network segmentation', 'Deploy ICS security monitoring']
      };
      setAnalysisResults(mockResults);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateReport = async () => {
    if (!selectedDevice) return;
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const report = {
        id: `IoT-${Date.now()}`,
        title: `IoT/SCADA Security Report: ${selectedDevice.name}`,
        generated: new Date().toISOString(),
        classification: 'CONFIDENTIAL - INDUSTRIAL SECURITY',
        summary: `Comprehensive IoT/SCADA security analysis reveals device vulnerabilities and protocol security issues.`,
        keyFindings: ['Industrial protocol analysis completed', 'Device vulnerabilities identified', 'Network security gaps found'],
        recommendations: ['Implement ICS security controls', 'Update industrial protocols', 'Deploy OT network monitoring'],
        technicalDetails: { analysisMethod: 'Industrial Control System Analysis', confidence: 91, riskScore: 78 }
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
    if (!selectedDevice) return;
    try {
      const exportData = { device: selectedDevice, analysisResults, timestamp: new Date().toISOString(), format: 'JSON', source: 'IoT/SCADA Monitoring System' };
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `iot-scada-analysis-${selectedDevice.id}-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      alert('IoT/SCADA analysis data exported successfully!');
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
            <p className="cyber-text-muted mt-4">Loading IoT/SCADA monitoring...</p>
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
            IoT/SCADA Monitoring
          </h1>
          <p className="cyber-text-secondary">
            Advanced monitoring and security analysis for IoT and SCADA systems
          </p>
        </div>

        {/* Master Input */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={analysisInput}
              onChange={(e) => setAnalysisInput(e.target.value)}
              placeholder="Enter device name, IP address, or protocol for IoT/SCADA analysis..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button 
              onClick={executeIoTAnalysis}
              disabled={isAnalyzing || !analysisInput.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors duration-200"
            >
              {isAnalyzing ? 'Analyzing...' : 'Execute IoT Analysis'}
            </button>
          </div>
          {analysisResults && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold cyber-text-primary mb-3">IoT/SCADA Analysis Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-sm cyber-text-muted">Security Level</p>
                  <p className="text-xl font-bold text-orange-500">{analysisResults.securityLevel}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm cyber-text-muted">Confidence</p>
                  <p className="text-xl font-bold text-blue-500">{analysisResults.confidence}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm cyber-text-muted">Devices Scanned</p>
                  <p className="text-xl font-bold text-green-500">{analysisResults.devicesScanned}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm cyber-text-muted">Vulnerabilities</p>
                  <p className="text-xl font-bold text-red-500">{analysisResults.vulnerabilities}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Function Categories */}
        {Object.entries(categoryTitles).map(([category, title]) => {
          const categoryFunctions = iotFunctions.filter(func => func.category === category);
          
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
                    onClick={() => handleAnalyzeDevice(func)}
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
                        Monitor
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Live IoT/SCADA Device Monitoring */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold cyber-text-primary mb-4 text-center">
            Live IoT/SCADA Device Monitoring
          </h2>
          <div className="space-y-4">
            {devices.map((device) => (
              <div
                key={device.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold cyber-text-primary">
                      {device.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(device.status)}`}>
                      {device.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getProtocolColor(device.protocol)}`}>
                      {device.protocol}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRiskColor(device.riskLevel)}`}>
                      {device.riskLevel} Risk
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full text-xs font-semibold">
                      {device.vulnerabilities} Vulnerabilities
                    </span>
                  </div>
                </div>
                <p className="text-sm cyber-text-secondary mb-2">
                  {device.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs cyber-text-muted mb-2">
                  <div>
                    <span className="font-semibold">Type:</span> {device.type}
                  </div>
                  <div>
                    <span className="font-semibold">IP Address:</span> {device.ipAddress}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs cyber-text-muted mb-2">
                  <div>
                    <span className="font-semibold">Affected Systems:</span> {device.affectedSystems.join(', ')}
                  </div>
                  <div>
                    <span className="font-semibold">Last Seen:</span> {new Date(device.lastSeen).toLocaleString()}
                  </div>
                </div>
                <div className="mb-2">
                  <span className="text-xs cyber-text-muted">Indicators: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {device.indicators.map((indicator, index) => (
                      <span key={index} className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded text-xs">
                        {indicator}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xs cyber-text-muted">Detection: </span>
                  <span className="text-xs cyber-accent-blue">
                    {device.detection}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis Modal */}
        {showAnalysis && selectedDevice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold cyber-text-primary">
                    {selectedDevice.name} Analysis
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
                      {selectedDevice.description}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Status</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      selectedDevice.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {selectedDevice.status}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Category</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
                      {selectedDevice.category.toUpperCase()}
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
        {showReport && reportData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold cyber-text-primary">{reportData.title}</h2>
                  <button onClick={() => setShowReport(false)} className="text-gray-500 hover:text-gray-700">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-4">
                  <p className="text-sm cyber-text-secondary bg-gray-50 dark:bg-gray-700 p-3 rounded">{reportData.summary}</p>
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Key Findings</h3>
                    <ul className="text-sm cyber-text-secondary space-y-1">
                      {reportData.keyFindings.map((finding, index) => (<li key={index}>• {finding}</li>))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold cyber-text-primary mb-2">Recommendations</h3>
                    <ul className="text-sm cyber-text-secondary space-y-1">
                      {reportData.recommendations.map((rec, index) => (<li key={index}>• {rec}</li>))}
                    </ul>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowReport(false)} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors duration-200">Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IoTSCADAMonitoring;

