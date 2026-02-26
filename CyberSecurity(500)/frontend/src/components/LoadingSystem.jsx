import React from 'react';

// Professional Loading Spinner
export const LoadingSpinner = ({ 
  size = 'md', 
  color = 'blue', 
  className = '',
  text = null 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-4 w-4';
      case 'md': return 'h-8 w-8';
      case 'lg': return 'h-12 w-12';
      case 'xl': return 'h-16 w-16';
      default: return 'h-8 w-8';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'blue': return 'text-blue-600';
      case 'green': return 'text-green-600';
      case 'red': return 'text-red-600';
      case 'yellow': return 'text-yellow-600';
      case 'gray': return 'text-gray-600';
      case 'white': return 'text-white';
      default: return 'text-blue-600';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg
        className={`animate-spin ${getSizeClasses()} ${getColorClasses()}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

// Professional Progress Bar
export const ProgressBar = ({ 
  progress = 0, 
  showPercentage = true, 
  color = 'blue',
  size = 'md',
  animated = true,
  className = '' 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-2';
      case 'md': return 'h-3';
      case 'lg': return 'h-4';
      default: return 'h-3';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'blue': return 'bg-blue-600';
      case 'green': return 'bg-green-600';
      case 'red': return 'bg-red-600';
      case 'yellow': return 'bg-yellow-600';
      case 'purple': return 'bg-purple-600';
      default: return 'bg-blue-600';
    }
  };

  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={`w-full ${className}`}>
      {showPercentage && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progress
          </span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {Math.round(clampedProgress)}%
          </span>
        </div>
      )}
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${getSizeClasses()}`}>
        <div
          className={`${getSizeClasses()} ${getColorClasses()} rounded-full transition-all duration-300 ease-out ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

// Professional Skeleton Loader
export const SkeletonLoader = ({ 
  lines = 3, 
  className = '',
  avatar = false,
  button = false 
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {avatar && (
        <div className="flex items-center space-x-4 mb-4">
          <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-10 w-10" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`h-4 bg-gray-300 dark:bg-gray-600 rounded ${
              index === lines - 1 ? 'w-2/3' : 'w-full'
            }`}
          />
        ))}
      </div>
      
      {button && (
        <div className="mt-4">
          <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-32" />
        </div>
      )}
    </div>
  );
};

// Professional Full Page Loading
export const FullPageLoading = ({ 
  message = 'Loading...', 
  subMessage = null,
  progress = null 
}) => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center max-w-md mx-auto p-6">
        <LoadingSpinner size="xl" className="mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {message}
        </h2>
        {subMessage && (
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {subMessage}
          </p>
        )}
        {progress !== null && (
          <ProgressBar progress={progress} className="mt-4" />
        )}
      </div>
    </div>
  );
};

// Professional Card Loading
export const CardLoading = ({ 
  title = 'Loading data...', 
  className = '' 
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-3" />
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
};

// Professional Analysis Loading with Steps
export const AnalysisLoading = ({ 
  steps = [], 
  currentStep = 0, 
  className = '' 
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
      <div className="text-center mb-6">
        <LoadingSpinner size="lg" className="mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Processing Analysis
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Please wait while we analyze your data...
        </p>
      </div>
      
      {steps.length > 0 && (
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                index < currentStep 
                  ? 'bg-green-100 dark:bg-green-900' 
                  : index === currentStep 
                    ? 'bg-blue-100 dark:bg-blue-900' 
                    : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                {index < currentStep ? (
                  <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : index === currentStep ? (
                  <LoadingSpinner size="sm" color="blue" />
                ) : (
                  <span className="text-gray-400 dark:text-gray-500 text-sm font-medium">
                    {index + 1}
                  </span>
                )}
              </div>
              <span className={`text-sm ${
                index <= currentStep 
                  ? 'text-gray-900 dark:text-white font-medium' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Professional Data Table Loading
export const TableLoading = ({ 
  rows = 5, 
  columns = 4, 
  className = '' 
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden ${className}`}>
      <div className="animate-pulse">
        {/* Header */}
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-b border-gray-200 dark:border-gray-600">
          <div className="flex space-x-4">
            {Array.from({ length: columns }).map((_, index) => (
              <div key={index} className="h-4 bg-gray-300 dark:bg-gray-600 rounded flex-1" />
            ))}
          </div>
        </div>
        
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex space-x-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div 
                  key={colIndex} 
                  className={`h-4 bg-gray-300 dark:bg-gray-600 rounded flex-1 ${
                    colIndex === 0 ? 'w-1/4' : colIndex === columns - 1 ? 'w-1/6' : ''
                  }`} 
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Professional Loading States Hook
export const useLoadingStates = () => {
  const [loadingStates, setLoadingStates] = React.useState({});

  const setLoading = (key, isLoading, message = null) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading ? { loading: true, message } : { loading: false, message: null }
    }));
  };

  const isLoading = (key) => {
    return loadingStates[key]?.loading || false;
  };

  const getLoadingMessage = (key) => {
    return loadingStates[key]?.message || null;
  };

  const clearAllLoading = () => {
    setLoadingStates({});
  };

  return {
    setLoading,
    isLoading,
    getLoadingMessage,
    clearAllLoading,
    loadingStates
  };
};

export default {
  LoadingSpinner,
  ProgressBar,
  SkeletonLoader,
  FullPageLoading,
  CardLoading,
  AnalysisLoading,
  TableLoading,
  useLoadingStates
};
