/**
 * Professional Configuration for Cybersecurity Platform
 * Enterprise-grade configuration management
 */

// Application Configuration
export const APP_CONFIG = {
  name: 'NEXUS CYBER INTELLIGENCE',
  fullName: 'NEXUS CYBER INTELLIGENCE - Next-Generation AI Security Operations Platform',
  shortName: 'NEXUS CI',
  version: '2.0.0',
  environment: process.env.NODE_ENV || 'development',
  apiBaseUrl: process.env.REACT_APP_API_URL || 'https://api.cybersecurity-platform.com',
  wsBaseUrl: process.env.REACT_APP_WS_URL || 'wss://ws.cybersecurity-platform.com',
  
  // Feature flags
  features: {
    realTimeThreats: true,
    advancedAnalytics: true,
    mlModels: true,
    auditLogging: true,
    professionalUI: true,
    errorBoundary: true,
    rateLimiting: true,
    inputValidation: true,
    securityMonitoring: true
  },
  
  // UI Configuration
  ui: {
    theme: {
      default: 'dark',
      allowToggle: true
    },
    animations: {
      enabled: true,
      duration: 300
    },
    notifications: {
      position: 'top-right',
      maxVisible: 5,
      defaultDuration: 5000
    }
  },
  
  // Security Configuration
  security: {
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    csrfProtection: true,
    contentSecurityPolicy: true,
    auditLogging: true
  },
  
  // Performance Configuration
  performance: {
    enableServiceWorker: true,
    enableCodeSplitting: true,
    enableLazyLoading: true,
    cacheStrategy: 'stale-while-revalidate',
    maxCacheSize: 50 * 1024 * 1024 // 50MB
  }
};

// Analysis Configuration
export const ANALYSIS_CONFIG = {
  // Phishing Detection
  phishing: {
    maxInputLength: 10000,
    timeoutMs: 30000,
    retryAttempts: 3,
    confidenceThreshold: 0.7,
    models: {
      url: {
        enabled: true,
        endpoint: '/api/analysis/phishing/url',
        timeout: 15000
      },
      email: {
        enabled: true,
        endpoint: '/api/analysis/phishing/email',
        timeout: 20000
      },
      ml: {
        enabled: true,
        endpoint: '/api/analysis/phishing/ml',
        timeout: 25000
      }
    }
  },
  
  // Malware Analysis
  malware: {
    maxFileSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: ['application/octet-stream', 'application/x-executable'],
    sandboxTimeout: 300000, // 5 minutes
    staticAnalysis: {
      enabled: true,
      timeout: 60000
    },
    dynamicAnalysis: {
      enabled: true,
      timeout: 180000
    }
  },
  
  // Network Analysis
  network: {
    maxPacketSize: 1500,
    analysisWindow: 60000, // 1 minute
    alertThreshold: 0.8,
    protocols: ['tcp', 'udp', 'icmp', 'http', 'https', 'dns']
  },
  
  // Real-time Processing
  realtime: {
    batchSize: 100,
    processingInterval: 1000,
    maxQueueSize: 10000,
    alertLatency: 500 // 500ms max alert latency
  }
};

// API Configuration
export const API_CONFIG = {
  baseURL: APP_CONFIG.apiBaseUrl,
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
  
  // Rate limiting
  rateLimits: {
    default: { requests: 100, window: 60000 },
    analysis: { requests: 10, window: 60000 },
    upload: { requests: 5, window: 60000 },
    export: { requests: 20, window: 60000 }
  },
  
  // Headers
  defaultHeaders: {
    'Content-Type': 'application/json',
    'X-Client-Version': APP_CONFIG.version,
    'X-Client-Platform': 'web'
  },
  
  // Endpoints
  endpoints: {
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
      profile: '/auth/profile'
    },
    analysis: {
      phishing: '/analysis/phishing',
      malware: '/analysis/malware',
      network: '/analysis/network',
      behavioral: '/analysis/behavioral'
    },
    intelligence: {
      threats: '/intelligence/threats',
      indicators: '/intelligence/indicators',
      feeds: '/intelligence/feeds'
    },
    reports: {
      generate: '/reports/generate',
      export: '/reports/export',
      schedule: '/reports/schedule'
    }
  }
};

// Logging Configuration
export const LOGGING_CONFIG = {
  level: process.env.NODE_ENV === 'development' ? 'DEBUG' : 'INFO',
  maxLogs: 10000,
  
  // Log levels
  levels: {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    CRITICAL: 4,
    SECURITY: 5
  },
  
  // Remote logging
  remote: {
    enabled: process.env.NODE_ENV === 'production',
    endpoint: '/api/logs',
    batchSize: 50,
    flushInterval: 30000
  },
  
  // Local storage
  localStorage: {
    enabled: true,
    maxSize: 5 * 1024 * 1024, // 5MB
    compression: true
  }
};

// Validation Configuration
export const VALIDATION_CONFIG = {
  // Input sanitization
  sanitization: {
    maxLength: 10000,
    allowHTML: false,
    allowSQL: false,
    allowScripts: false,
    stripControlChars: true
  },
  
  // Pattern validation
  patterns: {
    strictMode: true,
    customPatterns: {},
    caseInsensitive: false
  },
  
  // Error handling
  errorHandling: {
    showDetailedErrors: process.env.NODE_ENV === 'development',
    logValidationErrors: true,
    maxErrorsPerField: 5
  }
};

// Notification Configuration
export const NOTIFICATION_CONFIG = {
  // Default settings
  defaults: {
    duration: 5000,
    position: 'top-right',
    showProgress: true,
    pauseOnHover: true,
    closeOnClick: true
  },
  
  // Type-specific settings
  types: {
    success: { duration: 4000, icon: 'check' },
    error: { duration: 8000, icon: 'error', persistent: false },
    warning: { duration: 6000, icon: 'warning' },
    info: { duration: 5000, icon: 'info' },
    loading: { persistent: true, icon: 'spinner' }
  },
  
  // Limits
  limits: {
    maxVisible: 5,
    maxQueue: 20,
    maxHistory: 100
  }
};

// Theme Configuration
export const THEME_CONFIG = {
  // Available themes
  themes: {
    light: {
      name: 'Professional Light',
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        success: '#059669',
        warning: '#d97706',
        error: '#dc2626',
        info: '#0891b2'
      }
    },
    dark: {
      name: 'Professional Dark',
      colors: {
        primary: '#3b82f6',
        secondary: '#94a3b8',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#06b6d4'
      }
    }
  },
  
  // Default theme
  default: 'dark',
  
  // Theme persistence
  persistence: {
    enabled: true,
    storageKey: 'cybersecurity-theme',
    syncAcrossTabs: true
  }
};

// Export all configurations
export default {
  APP_CONFIG,
  ANALYSIS_CONFIG,
  API_CONFIG,
  LOGGING_CONFIG,
  VALIDATION_CONFIG,
  NOTIFICATION_CONFIG,
  THEME_CONFIG
};
