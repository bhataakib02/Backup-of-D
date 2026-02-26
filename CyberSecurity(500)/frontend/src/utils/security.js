// Professional Security Utilities for NEXUS CYBER INTELLIGENCE
// Enterprise-Grade Security Operations Platform

// Security Event Types
export const SECURITY_EVENTS = {
  DATA_ACCESS: 'data_access',
  FUNCTION_EXECUTION: 'function_execution',
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  SECURITY_VIOLATION: 'security_violation',
  SESSION_TIMEOUT: 'session_timeout',
  RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
  INPUT_VALIDATION_FAILED: 'input_validation_failed',
  XSS_ATTEMPT: 'xss_attempt',
  SQL_INJECTION_ATTEMPT: 'sql_injection_attempt',
  COMMAND_INJECTION_ATTEMPT: 'command_injection_attempt'
};

// Professional Audit Logger
class AuditLogger {
  constructor() {
    this.logs = [];
    this.maxLogs = 10000;
    this.sessionId = this.generateSessionId();
  }

  generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  log(level, event, message, metadata = {}) {
    const logEntry = {
      id: this.generateLogId(),
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      level,
      event,
      message,
      metadata: {
        ...metadata,
        userAgent: navigator.userAgent,
        url: window.location.href,
        referrer: document.referrer,
        timestamp: Date.now()
      }
    };

    this.logs.push(logEntry);
    
    // Maintain log size limit
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Send to backend in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToBackend(logEntry);
    }

    // Console output for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${level.toUpperCase()}] ${event}: ${message}`, metadata);
    }

    return logEntry;
  }

  generateLogId() {
    return 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  async sendToBackend(logEntry) {
    try {
      await fetch('/api/audit/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logEntry)
      });
    } catch (error) {
      console.error('Failed to send audit log to backend:', error);
    }
  }

  info(event, message, metadata = {}) {
    return this.log('info', event, message, metadata);
  }

  warn(event, message, metadata = {}) {
    return this.log('warn', event, message, metadata);
  }

  error(event, message, metadata = {}) {
    return this.log('error', event, message, metadata);
  }

  security(event, message, metadata = {}) {
    return this.log('security', event, message, metadata);
  }

  debug(event, message, metadata = {}) {
    return this.log('debug', event, message, metadata);
  }

  getLogs(filters = {}) {
    let filteredLogs = [...this.logs];

    if (filters.level) {
      filteredLogs = filteredLogs.filter(log => log.level === filters.level);
    }

    if (filters.event) {
      filteredLogs = filteredLogs.filter(log => log.event === filters.event);
    }

    if (filters.startTime) {
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= new Date(filters.startTime));
    }

    if (filters.endTime) {
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= new Date(filters.endTime));
    }

    return filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  exportLogs(format = 'json') {
    const logs = this.getLogs();
    
    if (format === 'csv') {
      const headers = ['Timestamp', 'Level', 'Event', 'Message', 'Session ID'];
      const csvContent = [
        headers.join(','),
        ...logs.map(log => [
          log.timestamp,
          log.level,
          log.event,
          `"${log.message.replace(/"/g, '""')}"`,
          log.sessionId
        ].join(','))
      ].join('\n');
      
      return csvContent;
    }

    return JSON.stringify(logs, null, 2);
  }
}

// Professional Session Manager
class SessionManager {
  constructor() {
    this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
    this.warningTimeout = 5 * 60 * 1000; // 5 minutes before timeout
    this.lastActivity = Date.now();
    this.sessionId = this.generateSessionId();
    this.isActive = true;
    
    this.startActivityMonitoring();
  }

  generateSessionId() {
    return 'nexus_' + Date.now() + '_' + Math.random().toString(36).substr(2, 12);
  }

  updateActivity() {
    this.lastActivity = Date.now();
    
    if (!this.isActive) {
      this.isActive = true;
      auditLogger.info(SECURITY_EVENTS.AUTHENTICATION, 'Session reactivated', {
        sessionId: this.sessionId
      });
    }
  }

  startActivityMonitoring() {
    setInterval(() => {
      const now = Date.now();
      const timeSinceActivity = now - this.lastActivity;

      // Warning before timeout
      if (timeSinceActivity > (this.sessionTimeout - this.warningTimeout) && this.isActive) {
        this.showTimeoutWarning();
      }

      // Session timeout
      if (timeSinceActivity > this.sessionTimeout && this.isActive) {
        this.handleSessionTimeout();
      }
    }, 60000); // Check every minute
  }

  showTimeoutWarning() {
    auditLogger.warn(SECURITY_EVENTS.SESSION_TIMEOUT, 'Session timeout warning', {
      sessionId: this.sessionId,
      timeRemaining: this.warningTimeout
    });

    // Show user warning
    if (window.confirm('Your session will expire in 5 minutes due to inactivity. Click OK to continue working.')) {
      this.updateActivity();
    }
  }

  handleSessionTimeout() {
    this.isActive = false;
    
    auditLogger.security(SECURITY_EVENTS.SESSION_TIMEOUT, 'Session expired due to inactivity', {
      sessionId: this.sessionId,
      lastActivity: new Date(this.lastActivity).toISOString()
    });

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('sessionTimeout', {
      detail: { sessionId: this.sessionId }
    }));
  }

  getSessionInfo() {
    return {
      sessionId: this.sessionId,
      isActive: this.isActive,
      lastActivity: new Date(this.lastActivity).toISOString(),
      timeRemaining: Math.max(0, this.sessionTimeout - (Date.now() - this.lastActivity))
    };
  }
}

// Professional Input Sanitizer
class InputSanitizer {
  static sanitizeString(input) {
    if (typeof input !== 'string') return input;
    
    // XSS Prevention
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
      /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi
    ];

    let sanitized = input;
    xssPatterns.forEach(pattern => {
      if (pattern.test(sanitized)) {
        auditLogger.security(SECURITY_EVENTS.XSS_ATTEMPT, 'XSS attempt detected', {
          input: input.substring(0, 100),
          pattern: pattern.toString()
        });
      }
      sanitized = sanitized.replace(pattern, '');
    });

    // SQL Injection Prevention
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi,
      /(';|'--|\*|%)/gi
    ];

    sqlPatterns.forEach(pattern => {
      if (pattern.test(sanitized)) {
        auditLogger.security(SECURITY_EVENTS.SQL_INJECTION_ATTEMPT, 'SQL injection attempt detected', {
          input: input.substring(0, 100),
          pattern: pattern.toString()
        });
      }
    });

    // Command Injection Prevention
    const cmdPatterns = [
      /(\||&|;|\$\(|\`)/g,
      /(rm\s|del\s|format\s|shutdown\s)/gi
    ];

    cmdPatterns.forEach(pattern => {
      if (pattern.test(sanitized)) {
        auditLogger.security(SECURITY_EVENTS.COMMAND_INJECTION_ATTEMPT, 'Command injection attempt detected', {
          input: input.substring(0, 100),
          pattern: pattern.toString()
        });
      }
    });

    // HTML Entity Encoding
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');

    return sanitized;
  }

  static validateInput(input, type = 'string', options = {}) {
    const validation = {
      isValid: true,
      errors: [],
      sanitized: input
    };

    // Required field validation
    if (options.required && (!input || input.toString().trim() === '')) {
      validation.isValid = false;
      validation.errors.push('Field is required');
      return validation;
    }

    // Type-specific validation
    switch (type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (input && !emailRegex.test(input)) {
          validation.isValid = false;
          validation.errors.push('Invalid email format');
        }
        break;

      case 'url':
        try {
          if (input) new URL(input);
        } catch {
          validation.isValid = false;
          validation.errors.push('Invalid URL format');
        }
        break;

      case 'ip':
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (input && !ipRegex.test(input)) {
          validation.isValid = false;
          validation.errors.push('Invalid IP address format');
        }
        break;

      case 'hash':
        const hashRegex = /^[a-fA-F0-9]+$/;
        if (input && !hashRegex.test(input)) {
          validation.isValid = false;
          validation.errors.push('Invalid hash format');
        }
        break;
    }

    // Length validation
    if (options.minLength && input && input.length < options.minLength) {
      validation.isValid = false;
      validation.errors.push(`Minimum length is ${options.minLength} characters`);
    }

    if (options.maxLength && input && input.length > options.maxLength) {
      validation.isValid = false;
      validation.errors.push(`Maximum length is ${options.maxLength} characters`);
    }

    // Sanitize if valid
    if (validation.isValid && typeof input === 'string') {
      validation.sanitized = this.sanitizeString(input);
    }

    return validation;
  }
}

// Professional Rate Limiter
class RateLimiter {
  constructor() {
    this.requests = new Map();
    this.limits = {
      default: { requests: 100, window: 60000 }, // 100 requests per minute
      analysis: { requests: 10, window: 60000 },  // 10 analysis per minute
      upload: { requests: 5, window: 60000 }      // 5 uploads per minute
    };
  }

  isAllowed(identifier, type = 'default') {
    const limit = this.limits[type] || this.limits.default;
    const now = Date.now();
    const windowStart = now - limit.window;

    // Get or create request history for this identifier
    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, []);
    }

    const requestHistory = this.requests.get(identifier);
    
    // Remove old requests outside the window
    const validRequests = requestHistory.filter(timestamp => timestamp > windowStart);
    this.requests.set(identifier, validRequests);

    // Check if limit exceeded
    if (validRequests.length >= limit.requests) {
      auditLogger.security(SECURITY_EVENTS.RATE_LIMIT_EXCEEDED, 'Rate limit exceeded', {
        identifier,
        type,
        requests: validRequests.length,
        limit: limit.requests
      });
      return false;
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);

    return true;
  }

  getRemainingRequests(identifier, type = 'default') {
    const limit = this.limits[type] || this.limits.default;
    const requestHistory = this.requests.get(identifier) || [];
    const now = Date.now();
    const windowStart = now - limit.window;
    const validRequests = requestHistory.filter(timestamp => timestamp > windowStart);
    
    return Math.max(0, limit.requests - validRequests.length);
  }
}

// Initialize global instances
export const auditLogger = new AuditLogger();
export const sessionManager = new SessionManager();
export const inputSanitizer = InputSanitizer;
export const rateLimiter = new RateLimiter();

// Professional Error Handler
export class ErrorHandler {
  static handle(error, context = {}) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    auditLogger.error(SECURITY_EVENTS.SECURITY_VIOLATION, 'Application error occurred', errorInfo);

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      this.sendToErrorTracking(errorInfo);
    }

    return errorInfo;
  }

  static async sendToErrorTracking(errorInfo) {
    try {
      await fetch('/api/errors/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorInfo)
      });
    } catch (err) {
      console.error('Failed to send error to tracking service:', err);
    }
  }
}

// Professional Security Headers
export const SecurityHeaders = {
  getCSPHeader() {
    return "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:; font-src 'self' https:;";
  },

  setSecurityHeaders() {
    // These would typically be set by the server, but we can add meta tags
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = this.getCSPHeader();
    document.head.appendChild(meta);
  }
};

// Initialize security on module load
SecurityHeaders.setSecurityHeaders();

export default {
  auditLogger,
  sessionManager,
  inputSanitizer,
  rateLimiter,
  ErrorHandler,
  SecurityHeaders,
  SECURITY_EVENTS
};