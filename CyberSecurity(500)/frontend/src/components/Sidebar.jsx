import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/phishing', label: 'Phishing Detection', icon: '🎣' },
    { path: '/malware', label: 'Malware Analysis', icon: '🦠' },
    { path: '/ids', label: 'Network IDS', icon: '🔍' },
    { path: '/fusion', label: 'Fusion Engine', icon: '⚡' },
    { path: '/ransomware', label: 'Ransomware Detection', icon: '🔒' },
    { path: '/threat-intel', label: 'Threat Intelligence', icon: '🌐' },
    { path: '/advanced', label: 'Advanced Features', icon: '🚀' },
    { path: '/encoder-decoder', label: 'Encoder/Decoder', icon: '🔐' },
    { path: '/real-time-threats', label: 'Real-Time Threats', icon: '🌍' },
    { path: '/3d-globe', label: '3D Globe', icon: '🌐' },
    { path: '/hunt', label: 'Threat Hunting', icon: '🕵️' },
    { path: '/reports', label: 'Reports', icon: '📄' },
    { path: '/dlp', label: 'DLP', icon: '🛡️' },
    { path: '/soar-builder', label: 'SOAR Builder', icon: '🧩' }
  ];

  return (
    <aside className="fixed top-16 left-0 w-72 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto z-30 hidden md:block">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Security Modules
        </h2>
        <nav>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center p-3 rounded-lg mb-2 transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;