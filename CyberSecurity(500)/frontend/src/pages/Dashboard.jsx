import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
          NEXUS CYBER INTELLIGENCE
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Next-Generation AI Security Operations Platform
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Threats</h3>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">1,247</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Alerts</h3>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">23</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Health</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">98%</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Functions</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">780+</p>
        </div>
      </div>

      {/* Security Modules */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Security Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/phishing" className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-lg hover:border-blue-500 transition-all">
            <div className="text-center">
              <div className="text-3xl mb-2">🎣</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Phishing Detection</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">70 Functions</p>
            </div>
          </Link>
          
          <Link to="/malware" className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-lg hover:border-blue-500 transition-all">
            <div className="text-center">
              <div className="text-3xl mb-2">🦠</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Malware Analysis</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">70 Functions</p>
            </div>
          </Link>
          
          <Link to="/ids" className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-lg hover:border-blue-500 transition-all">
            <div className="text-center">
              <div className="text-3xl mb-2">🔍</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Network IDS</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">70 Functions</p>
            </div>
          </Link>
          
          <Link to="/fusion" className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-lg hover:border-blue-500 transition-all">
            <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Fusion Engine</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">40 Functions</p>
            </div>
          </Link>
          
          <Link to="/ransomware" className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-lg hover:border-blue-500 transition-all">
            <div className="text-center">
              <div className="text-3xl mb-2">🔒</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Ransomware</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">30 Functions</p>
            </div>
          </Link>
          
          <Link to="/threat-intel" className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-lg hover:border-blue-500 transition-all">
            <div className="text-center">
              <div className="text-3xl mb-2">🌐</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Threat Intel</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">40 Functions</p>
            </div>
          </Link>
          
          <Link to="/advanced" className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-lg hover:border-blue-500 transition-all">
            <div className="text-center">
              <div className="text-3xl mb-2">🚀</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Advanced AI/ML</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">460+ Functions</p>
            </div>
          </Link>
          
          <Link to="/encoder-decoder" className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-lg hover:border-blue-500 transition-all">
            <div className="text-center">
              <div className="text-3xl mb-2">🔐</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Encoder/Decoder</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">20 Functions</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;