import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './components/NotificationSystem';
import ErrorBoundary from './components/ErrorBoundary';
import { auditLogger, sessionManager, SECURITY_EVENTS } from './utils/security';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Phishing from './pages/Phishing';
import Malware from './pages/Malware';
import IDS from './pages/IDS';
import ThreatIntel from './pages/ThreatIntel';
import Fusion from './pages/Fusion';
import Ransomware from './pages/Ransomware';
import Advanced from './pages/Advanced';
import EncoderDecoder from './pages/EncoderDecoder';
import RealTimeThreats from './pages/RealTimeThreats';
import './styles/global.css';

function App() {
  useEffect(() => {
    // Initialize professional security and audit logging
    auditLogger.info(SECURITY_EVENTS.DATA_ACCESS, 'NEXUS CYBER INTELLIGENCE Platform Initialized', {
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      platform: 'NEXUS_CYBER_INTELLIGENCE',
      version: '2.0.0',
      environment: process.env.NODE_ENV || 'production'
    });

    // Set up session timeout handler
    const handleSessionTimeout = () => {
      auditLogger.security(SECURITY_EVENTS.SESSION_TIMEOUT, 'Session expired due to inactivity');
      alert('Your session has expired due to inactivity. Please refresh the page to continue.');
      window.location.reload();
    };

    window.addEventListener('sessionTimeout', handleSessionTimeout);

    // Track user activity for session management
    const trackActivity = () => {
      sessionManager.updateActivity();
    };
    
    // Enhanced activity tracking
    const activityEvents = [
      'mousedown', 'mousemove', 'keypress', 'scroll', 
      'touchstart', 'click', 'focus', 'blur'
    ];
    
    activityEvents.forEach(event => {
      document.addEventListener(event, trackActivity, { passive: true });
    });

    return () => {
      window.removeEventListener('sessionTimeout', handleSessionTimeout);
      activityEvents.forEach(event => {
        document.removeEventListener(event, trackActivity);
      });
      auditLogger.info(SECURITY_EVENTS.DATA_ACCESS, 'Application cleanup completed');
    };
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <Router>
            <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
              <Navbar />
              <Sidebar />
              <main className="ml-0 md:ml-72 pt-16 pb-20 md:pb-6 p-4 md:p-6 transition-all duration-300">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/phishing" element={<Phishing />} />
                  <Route path="/malware" element={<Malware />} />
                  <Route path="/ids" element={<IDS />} />
                  <Route path="/threat-intel" element={<ThreatIntel />} />
                  <Route path="/fusion" element={<Fusion />} />
                  <Route path="/ransomware" element={<Ransomware />} />
                  <Route path="/advanced" element={<Advanced />} />
                  <Route path="/encoder-decoder" element={<EncoderDecoder />} />
                  <Route path="/real-time-threats" element={<RealTimeThreats />} />
                </Routes>
              </main>
            </div>
          </Router>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;