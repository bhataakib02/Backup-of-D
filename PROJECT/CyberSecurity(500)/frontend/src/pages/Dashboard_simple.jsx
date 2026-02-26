import React from 'react';

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Security Command Center - SIMPLE VERSION
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          This is a simplified dashboard to test functionality
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              Total Threats Detected
            </h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              1,247
            </p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
              Active Alerts
            </h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              23
            </p>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
              System Health
            </h3>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              98%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
