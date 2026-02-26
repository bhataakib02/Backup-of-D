import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const MobileNav = () => {
  const location = useLocation();

  const items = [
    { path: '/dashboard', label: 'Home', icon: '🏠' },
    { path: '/hunt', label: 'Hunt', icon: '🕵️' },
    { path: '/3d-globe', label: 'Globe', icon: '🌐' },
    { path: '/reports', label: 'Reports', icon: '📄' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-30">
      <div className="grid grid-cols-4">
        {items.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2 text-sm ${
                active
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;






