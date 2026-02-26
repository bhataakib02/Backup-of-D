import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './components/NotificationSystem';
import ErrorBoundary from './components/ErrorBoundary';
import { auditLogger, sessionManager, SECURITY_EVENTS } from './utils/security';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Phishing from './pages/Phishing';
import PhishingFunction from './pages/PhishingFunction';
import Malware from './pages/Malware';
import MalwareFunction from './pages/MalwareFunction';
import IDS from './pages/IDS';
import IDSFunction from './pages/IDSFunction';
import ThreatIntel from './pages/ThreatIntel';
import ThreatIntelFunction from './pages/ThreatIntelFunction';
import Fusion from './pages/Fusion';
import FusionFunction from './pages/FusionFunction';
import Ransomware from './pages/Ransomware';
import RansomwareFunction from './pages/RansomwareFunction';
import Advanced from './pages/Advanced';
import AdvancedFunction from './pages/AdvancedFunction';
import EncoderDecoder from './pages/EncoderDecoder';
import EncoderDecoderFunction from './pages/EncoderDecoderFunction';
import RealTimeThreats from './pages/RealTimeThreats';
import ZeroDayPrediction from './pages/ZeroDayPrediction';
import DarkWebIntelligence from './pages/DarkWebIntelligence';
import CryptoCrimeTracking from './pages/CryptoCrimeTracking';
import QuantumSafeMonitoring from './pages/QuantumSafeMonitoring';
import Globe3DVisualization from './pages/3DGlobeVisualization';
import MITREAttackMapping from './pages/MITREAttackMapping';
import FilelessMalwareDetection from './pages/FilelessMalwareDetection';
import EncryptedTrafficAnalysis from './pages/EncryptedTrafficAnalysis';
import InsiderThreatDetection from './pages/InsiderThreatDetection';
import MultiCloudCorrelation from './pages/MultiCloudCorrelation';
import IoTSCADAMonitoring from './pages/IoTSCADAMonitoring';
import SupplyChainRisk from './pages/SupplyChainRisk';
import ReinforcementLearning from './pages/ReinforcementLearning';
import GenerativeAISimulation from './pages/GenerativeAISimulation';
import './styles/global.css';

function App() {
  useEffect(() => {
    // Initialize professional security and audit logging
    auditLogger.info(SECURITY_EVENTS.DATA_ACCESS, 'Application initialized', {
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      url: window.location.href
    });

    // Set up session timeout handler
    const handleSessionTimeout = () => {
      alert('Your session has expired due to inactivity. Please refresh the page to continue.');
      window.location.reload();
    };

    window.addEventListener('sessionTimeout', handleSessionTimeout);

    // Track user activity for session management
    const trackActivity = () => sessionManager.updateActivity();
    
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
      document.addEventListener(event, trackActivity, { passive: true });
    });

    return () => {
      window.removeEventListener('sessionTimeout', handleSessionTimeout);
      ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
        document.removeEventListener(event, trackActivity);
      });
    };
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <Router>
              <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
                <Navbar />
                <Sidebar />
                <main className="ml-0 md:ml-72 pt-16 md:pt-20 p-4 md:p-6 transition-all duration-300">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/phishing" element={<Phishing />} />
                  <Route path="/phishing/function/:id" element={<PhishingFunction />} />
                  <Route path="/malware" element={<Malware />} />
                  <Route path="/malware/function/:id" element={<MalwareFunction />} />
                  <Route path="/ids" element={<IDS />} />
                  <Route path="/ids/function/:id" element={<IDSFunction />} />
                  <Route path="/threat-intel" element={<ThreatIntel />} />
                  <Route path="/threat-intel/function/:id" element={<ThreatIntelFunction />} />
                  <Route path="/fusion" element={<Fusion />} />
                  <Route path="/fusion/function/:id" element={<FusionFunction />} />
                  <Route path="/ransomware" element={<Ransomware />} />
                  <Route path="/ransomware/function/:id" element={<RansomwareFunction />} />
                  <Route path="/advanced" element={<Advanced />} />
                  <Route path="/advanced/function/:id" element={<AdvancedFunction />} />
                  <Route path="/encoder-decoder" element={<EncoderDecoder />} />
                  <Route path="/encoder-decoder/function/:id" element={<EncoderDecoderFunction />} />
                  <Route path="/real-time-threats" element={<RealTimeThreats />} />
            <Route path="/zero-day-prediction" element={<ZeroDayPrediction />} />
            <Route path="/dark-web-intelligence" element={<DarkWebIntelligence />} />
            <Route path="/crypto-crime-tracking" element={<CryptoCrimeTracking />} />
            <Route path="/quantum-safe-monitoring" element={<QuantumSafeMonitoring />} />
            <Route path="/3d-globe-visualization" element={<Globe3DVisualization />} />
            <Route path="/mitre-attack-mapping" element={<MITREAttackMapping />} />
            <Route path="/fileless-malware-detection" element={<FilelessMalwareDetection />} />
            <Route path="/encrypted-traffic-analysis" element={<EncryptedTrafficAnalysis />} />
            <Route path="/insider-threat-detection" element={<InsiderThreatDetection />} />
            <Route path="/multi-cloud-correlation" element={<MultiCloudCorrelation />} />
            <Route path="/iot-scada-monitoring" element={<IoTSCADAMonitoring />} />
            <Route path="/supply-chain-risk" element={<SupplyChainRisk />} />
            <Route path="/reinforcement-learning" element={<ReinforcementLearning />} />
            <Route path="/generative-ai-simulation" element={<GenerativeAISimulation />} />
                </Routes>
            </main>
            </div>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
