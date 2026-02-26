import React from 'react';
import { auditLogger, ErrorHandler, SECURITY_EVENTS } from '../utils/security';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error with professional error handling
    const errorId = ErrorHandler.handle(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
      props: this.props
    });

    this.setState({
      error,
      errorInfo,
      errorId
    });

    // Additional security logging
    auditLogger.error(SECURITY_EVENTS.SECURITY_VIOLATION, 'React Error Boundary triggered', {
      errorMessage: error.message,
      componentStack: errorInfo.componentStack,
      errorId
    });
  }

  handleReload = () => {
    auditLogger.info(SECURITY_EVENTS.DATA_ACCESS, 'User initiated error recovery', {
      errorId: this.state.errorId
    });
    window.location.reload();
  };

  handleReset = () => {
    auditLogger.info(SECURITY_EVENTS.DATA_ACCESS, 'Error boundary reset', {
      errorId: this.state.errorId
    });
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                System Error Detected
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                NEXUS CYBER INTELLIGENCE encountered an unexpected error
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Error Details
              </h3>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Error ID:</span>
                  <span className="ml-2 font-mono text-gray-900 dark:text-white">
                    {this.state.errorId || 'Unknown'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Message:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {this.state.error?.message || 'Unknown error'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Time:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {new Date().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6">
                <summary className="text-sm font-semibold text-gray-900 dark:text-white cursor-pointer">
                  Technical Details (Development)
                </summary>
                <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded text-xs">
                  <pre className="whitespace-pre-wrap text-red-800 dark:text-red-200">
                    {this.state.error.stack}
                  </pre>
                  {this.state.errorInfo && (
                    <pre className="mt-2 whitespace-pre-wrap text-red-700 dark:text-red-300">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Reload Application
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                If this error persists, please contact your system administrator.
                <br />
                Error has been automatically logged for analysis.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;