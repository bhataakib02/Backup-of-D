/**
 * Mobile-First Dashboard Component for NEXUS CYBER INTELLIGENCE
 * Enterprise-grade mobile-responsive design with touch-optimized interface
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import axios from 'axios';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const MobileDashboard = ({ 
  className = '',
  onThreatSelect = () => {},
  onNavigate = () => {}
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Dashboard data state
  const [threats, setThreats] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [systemHealth, setSystemHealth] = useState({});

  // Load dashboard data
  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Load multiple data sources in parallel
      const [threatsRes, metricsRes, alertsRes, healthRes] = await Promise.all([
        axios.get('/api/threats/realtime'),
        axios.get('/api/dashboard/stats'),
        axios.get('/api/alerts/recent'),
        axios.get('/api/system/health')
      ]);

      if (threatsRes.data.success) {
        setThreats(threatsRes.data.threats || []);
      }

      if (metricsRes.data) {
        setMetrics(metricsRes.data);
      }

      if (alertsRes.data.success) {
        setAlerts(alertsRes.data.alerts || []);
      }

      if (healthRes.data.success) {
        setSystemHealth(healthRes.data);
      }

      setDashboardData({
        threats: threatsRes.data.threats || [],
        metrics: metricsRes.data,
        alerts: alertsRes.data.alerts || [],
        health: healthRes.data
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Touch handling for swipe gestures
  const handleTouchStart = useCallback((e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setSwipeDirection('left');
      // Navigate to next tab
      const tabs = ['overview', 'threats', 'analytics', 'alerts', 'settings'];
      const currentIndex = tabs.indexOf(activeTab);
      if (currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1]);
      }
    }

    if (isRightSwipe) {
      setSwipeDirection('right');
      // Navigate to previous tab
      const tabs = ['overview', 'threats', 'analytics', 'alerts', 'settings'];
      const currentIndex = tabs.indexOf(activeTab);
      if (currentIndex > 0) {
        setActiveTab(tabs[currentIndex - 1]);
      }
    }
  }, [touchStart, touchEnd, activeTab]);

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
    
    // Set up auto-refresh
    const interval = setInterval(loadDashboardData, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [loadDashboardData]);

  // Chart configurations
  const threatTrendChartData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [
      {
        label: 'Threats Detected',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4
      }
    ]
  };

  const threatTypeChartData = {
    labels: ['Malware', 'Phishing', 'DDoS', 'Intrusion', 'Other'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          '#ef4444',
          '#f97316',
          '#eab308',
          '#22c55e',
          '#6366f1'
        ],
        borderWidth: 0
      }
    ]
  };

  const systemHealthChartData = {
    labels: ['CPU', 'Memory', 'Network', 'Storage'],
    datasets: [
      {
        label: 'Usage %',
        data: [65, 78, 45, 82],
        backgroundColor: [
          '#22c55e',
          '#eab308',
          '#22c55e',
          '#f97316'
        ],
        borderWidth: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // Render overview tab
  const renderOverview = () => (
    <div className="space-y-4">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Threats</p>
              <p className="text-2xl font-bold text-red-600">{metrics.totalThreats || 0}</p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Alerts</p>
              <p className="text-2xl font-bold text-orange-600">{metrics.activeAlerts || 0}</p>
            </div>
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">System Health</p>
              <p className="text-2xl font-bold text-green-600">{metrics.systemHealth || 0}%</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Functions</p>
              <p className="text-2xl font-bold text-blue-600">{metrics.functionsActive || 0}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Threat Trend Chart */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Threat Trend (24h)</h3>
        <div className="h-48">
          <Line data={threatTrendChartData} options={chartOptions} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => onNavigate('/hunt')}
            className="flex items-center justify-center p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            Threat Hunt
          </button>
          
          <button 
            onClick={() => onNavigate('/reports')}
            className="flex items-center justify-center p-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            Reports
          </button>
        </div>
      </div>
    </div>
  );

  // Render threats tab
  const renderThreats = () => (
    <div className="space-y-4">
      {/* Threat Type Distribution */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Threat Distribution</h3>
        <div className="h-48">
          <Doughnut data={threatTypeChartData} options={chartOptions} />
        </div>
      </div>

      {/* Recent Threats List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Recent Threats</h3>
        </div>
        <div className="divide-y">
          {threats.slice(0, 5).map((threat, index) => (
            <div 
              key={threat.id || index}
              className="p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => onThreatSelect(threat)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    threat.severity === 'High' ? 'bg-red-500' :
                    threat.severity === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <div>
                    <p className="font-medium">{threat.type}</p>
                    <p className="text-sm text-gray-600">{threat.country}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{threat.severity}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(threat.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render analytics tab
  const renderAnalytics = () => (
    <div className="space-y-4">
      {/* System Health Chart */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">System Health</h3>
        <div className="h-48">
          <Bar data={systemHealthChartData} options={chartOptions} />
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 gap-3">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Detection Accuracy</p>
              <p className="text-2xl font-bold text-green-600">96.5%</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Response Time</p>
              <p className="text-2xl font-bold text-blue-600">2.3s</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render alerts tab
  const renderAlerts = () => (
    <div className="space-y-4">
      {/* Active Alerts */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Active Alerts</h3>
        </div>
        <div className="divide-y">
          {alerts.length > 0 ? alerts.map((alert, index) => (
            <div key={alert.id || index} className="p-4">
              <div className="flex items-start space-x-3">
                <div className={`w-3 h-3 rounded-full mt-2 ${
                  alert.severity === 'Critical' ? 'bg-red-500' :
                  alert.severity === 'High' ? 'bg-orange-500' :
                  alert.severity === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <div className="flex-1">
                  <p className="font-medium">{alert.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )) : (
            <div className="p-4 text-center text-gray-500">
              <p>No active alerts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Render settings tab
  const renderSettings = () => (
    <div className="space-y-4">
      {/* Settings Options */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Preferences</h3>
        </div>
        <div className="divide-y">
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-gray-600">Toggle dark theme</p>
            </div>
            <button className="w-12 h-6 bg-gray-200 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full shadow transform transition-transform"></div>
            </button>
          </div>
          
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">Notifications</p>
              <p className="text-sm text-gray-600">Enable push notifications</p>
            </div>
            <button className="w-12 h-6 bg-blue-600 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full shadow transform transition-transform translate-x-6"></div>
            </button>
          </div>
          
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">Auto-refresh</p>
              <p className="text-sm text-gray-600">Refresh data automatically</p>
            </div>
            <button className="w-12 h-6 bg-blue-600 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full shadow transform transition-transform translate-x-6"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div 
      className={`min-h-screen bg-gray-50 ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">NEXUS CYBER</h1>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="flex overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'threats', label: 'Threats', icon: '🛡️' },
            { id: 'analytics', label: 'Analytics', icon: '📈' },
            { id: 'alerts', label: 'Alerts', icon: '🚨' },
            { id: 'settings', label: 'Settings', icon: '⚙️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-20">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'threats' && renderThreats()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'alerts' && renderAlerts()}
        {activeTab === 'settings' && renderSettings()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="flex">
          {[
            { id: 'overview', icon: '📊', label: 'Overview' },
            { id: 'threats', icon: '🛡️', label: 'Threats' },
            { id: 'analytics', icon: '📈', label: 'Analytics' },
            { id: 'alerts', icon: '🚨', label: 'Alerts' },
            { id: 'settings', icon: '⚙️', label: 'Settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center py-2 text-xs ${
                activeTab === tab.id ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <span className="text-lg mb-1">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Swipe Indicator */}
      {swipeDirection && (
        <div className={`fixed top-1/2 left-4 transform -translate-y-1/2 text-2xl ${
          swipeDirection === 'left' ? 'text-blue-600' : 'text-gray-600'
        }`}>
          {swipeDirection === 'left' ? '→' : '←'}
        </div>
      )}
    </div>
  );
};

export default MobileDashboard;

