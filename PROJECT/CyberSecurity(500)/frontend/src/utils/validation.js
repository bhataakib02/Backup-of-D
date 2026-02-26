/**
 * Professional Validation Utilities for Cybersecurity Platform
 * Enterprise-grade input validation and sanitization
 */

// Input validation patterns
export const VALIDATION_PATTERNS = {
  // Network patterns
  IP_ADDRESS: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  IPV6_ADDRESS: /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/,
  DOMAIN: /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/,
  URL: /^https?:\/\/(?:[-\w.])+(?:\:[0-9]+)?(?:\/(?:[\w\/_.])*(?:\?(?:[\w&=%.])*)?(?:\#(?:[\w.])*)?)?$/,
  
  // Security patterns
  HASH_MD5: /^[a-f0-9]{32}$/i,
  HASH_SHA1: /^[a-f0-9]{40}$/i,
  HASH_SHA256: /^[a-f0-9]{64}$/i,
  HASH_SHA512: /^[a-f0-9]{128}$/i,
  
  // File patterns
  FILE_PATH: /^[a-zA-Z]:\\(?:[^\\/:*?"<>|\r\n]+\\)*[^\\/:*?"<>|\r\n]*$|^\/(?:[^\/\0]+\/)*[^\/\0]*$/,
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  
  // Malware patterns
  PROCESS_NAME: /^[a-zA-Z0-9_\-\.]+\.exe$/i,
  REGISTRY_KEY: /^HKEY_[A-Z_]+\\(?:[^\\]+\\)*[^\\]*$/,
  
  // Crypto patterns
  BITCOIN_ADDRESS: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
  ETHEREUM_ADDRESS: /^0x[a-fA-F0-9]{40}$/,
  
  // General patterns
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  ALPHANUMERIC_SPACE: /^[a-zA-Z0-9\s]+$/,
  NO_SPECIAL_CHARS: /^[a-zA-Z0-9\s\-_.]+$/
};

// Validation error messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_FORMAT: 'Invalid format provided',
  INVALID_IP: 'Please enter a valid IP address (IPv4 or IPv6)',
  INVALID_DOMAIN: 'Please enter a valid domain name',
  INVALID_URL: 'Please enter a valid URL (http/https)',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_HASH: 'Please enter a valid hash (MD5, SHA1, SHA256, or SHA512)',
  INVALID_FILE_PATH: 'Please enter a valid file path',
  INVALID_PROCESS: 'Please enter a valid process name (.exe)',
  INVALID_REGISTRY: 'Please enter a valid registry key path',
  INVALID_CRYPTO_ADDRESS: 'Please enter a valid cryptocurrency address',
  TOO_SHORT: 'Input is too short (minimum {min} characters)',
  TOO_LONG: 'Input is too long (maximum {max} characters)',
  CONTAINS_MALICIOUS: 'Input contains potentially malicious content',
  RATE_LIMITED: 'Too many requests. Please wait before trying again',
  NETWORK_ERROR: 'Network connection error. Please check your connection',
  SERVER_ERROR: 'Server error occurred. Please try again later',
  UNAUTHORIZED: 'Unauthorized access. Please check your permissions',
  FORBIDDEN: 'Access forbidden. Contact administrator for access',
  NOT_FOUND: 'Requested resource not found',
  TIMEOUT: 'Request timeout. Please try again'
};

// Input sanitization
export const sanitizeInput = (input, options = {}) => {
  if (typeof input !== 'string') return '';
  
  let sanitized = input.trim();
  
  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');
  
  // Remove control characters except newlines and tabs if allowed
  if (!options.allowControlChars) {
    sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  }
  
  // Remove script tags
  if (!options.allowHTML) {
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  }
  
  // Remove SQL injection patterns
  if (!options.allowSQL) {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
      /(--|\/\*|\*\/|;|'|"|`)/g
    ];
    sqlPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
  }
  
  // Length limits
  if (options.maxLength) {
    sanitized = sanitized.substring(0, options.maxLength);
  }
  
  return sanitized;
};

// Comprehensive validation function
export const validateInput = (value, rules = {}) => {
  const errors = [];
  const sanitized = sanitizeInput(value, rules.sanitize);
  
  // Required validation
  if (rules.required && (!sanitized || sanitized.length === 0)) {
    errors.push(VALIDATION_MESSAGES.REQUIRED);
    return { isValid: false, errors, sanitized };
  }
  
  // Skip other validations if empty and not required
  if (!sanitized && !rules.required) {
    return { isValid: true, errors: [], sanitized };
  }
  
  // Length validation
  if (rules.minLength && sanitized.length < rules.minLength) {
    errors.push(VALIDATION_MESSAGES.TOO_SHORT.replace('{min}', rules.minLength));
  }
  
  if (rules.maxLength && sanitized.length > rules.maxLength) {
    errors.push(VALIDATION_MESSAGES.TOO_LONG.replace('{max}', rules.maxLength));
  }
  
  // Pattern validation
  if (rules.pattern && !rules.pattern.test(sanitized)) {
    errors.push(rules.message || VALIDATION_MESSAGES.INVALID_FORMAT);
  }
  
  // Type-specific validation
  if (rules.type) {
    switch (rules.type) {
      case 'ip':
        if (!VALIDATION_PATTERNS.IP_ADDRESS.test(sanitized) && !VALIDATION_PATTERNS.IPV6_ADDRESS.test(sanitized)) {
          errors.push(VALIDATION_MESSAGES.INVALID_IP);
        }
        break;
      case 'domain':
        if (!VALIDATION_PATTERNS.DOMAIN.test(sanitized)) {
          errors.push(VALIDATION_MESSAGES.INVALID_DOMAIN);
        }
        break;
      case 'url':
        if (!VALIDATION_PATTERNS.URL.test(sanitized)) {
          errors.push(VALIDATION_MESSAGES.INVALID_URL);
        }
        break;
      case 'email':
        if (!VALIDATION_PATTERNS.EMAIL.test(sanitized)) {
          errors.push(VALIDATION_MESSAGES.INVALID_EMAIL);
        }
        break;
      case 'hash':
        const hashPatterns = [
          VALIDATION_PATTERNS.HASH_MD5,
          VALIDATION_PATTERNS.HASH_SHA1,
          VALIDATION_PATTERNS.HASH_SHA256,
          VALIDATION_PATTERNS.HASH_SHA512
        ];
        if (!hashPatterns.some(pattern => pattern.test(sanitized))) {
          errors.push(VALIDATION_MESSAGES.INVALID_HASH);
        }
        break;
      case 'process':
        if (!VALIDATION_PATTERNS.PROCESS_NAME.test(sanitized)) {
          errors.push(VALIDATION_MESSAGES.INVALID_PROCESS);
        }
        break;
      case 'registry':
        if (!VALIDATION_PATTERNS.REGISTRY_KEY.test(sanitized)) {
          errors.push(VALIDATION_MESSAGES.INVALID_REGISTRY);
        }
        break;
      case 'crypto':
        if (!VALIDATION_PATTERNS.BITCOIN_ADDRESS.test(sanitized) && 
            !VALIDATION_PATTERNS.ETHEREUM_ADDRESS.test(sanitized)) {
          errors.push(VALIDATION_MESSAGES.INVALID_CRYPTO_ADDRESS);
        }
        break;
    }
  }
  
  // Custom validation function
  if (rules.validator && typeof rules.validator === 'function') {
    const customResult = rules.validator(sanitized);
    if (customResult !== true) {
      errors.push(customResult || VALIDATION_MESSAGES.INVALID_FORMAT);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized
  };
};

// Rate limiting utility
class RateLimiter {
  constructor() {
    this.requests = new Map();
  }
  
  isAllowed(key, limit = 10, windowMs = 60000) {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const requests = this.requests.get(key);
    
    // Remove old requests
    const validRequests = requests.filter(time => time > windowStart);
    this.requests.set(key, validRequests);
    
    if (validRequests.length >= limit) {
      return false;
    }
    
    validRequests.push(now);
    return true;
  }
  
  getRemainingTime(key, windowMs = 60000) {
    if (!this.requests.has(key)) return 0;
    
    const requests = this.requests.get(key);
    if (requests.length === 0) return 0;
    
    const oldestRequest = Math.min(...requests);
    const remaining = windowMs - (Date.now() - oldestRequest);
    
    return Math.max(0, remaining);
  }
}

export const rateLimiter = new RateLimiter();

// Professional error handling
export const handleApiError = (error) => {
  if (!error.response) {
    return {
      type: 'NETWORK_ERROR',
      message: VALIDATION_MESSAGES.NETWORK_ERROR,
      code: 'NETWORK_ERROR'
    };
  }
  
  const { status, data } = error.response;
  
  switch (status) {
    case 400:
      return {
        type: 'VALIDATION_ERROR',
        message: data?.message || VALIDATION_MESSAGES.INVALID_FORMAT,
        code: 'BAD_REQUEST',
        details: data?.errors || []
      };
    case 401:
      return {
        type: 'AUTH_ERROR',
        message: VALIDATION_MESSAGES.UNAUTHORIZED,
        code: 'UNAUTHORIZED'
      };
    case 403:
      return {
        type: 'AUTH_ERROR',
        message: VALIDATION_MESSAGES.FORBIDDEN,
        code: 'FORBIDDEN'
      };
    case 404:
      return {
        type: 'NOT_FOUND',
        message: VALIDATION_MESSAGES.NOT_FOUND,
        code: 'NOT_FOUND'
      };
    case 429:
      return {
        type: 'RATE_LIMIT',
        message: VALIDATION_MESSAGES.RATE_LIMITED,
        code: 'RATE_LIMITED',
        retryAfter: error.response.headers['retry-after']
      };
    case 500:
    case 502:
    case 503:
    case 504:
      return {
        type: 'SERVER_ERROR',
        message: VALIDATION_MESSAGES.SERVER_ERROR,
        code: 'SERVER_ERROR'
      };
    default:
      return {
        type: 'UNKNOWN_ERROR',
        message: data?.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR'
      };
  }
};

// Input validation rules for different cybersecurity contexts
export const VALIDATION_RULES = {
  // Phishing Detection
  phishing: {
    url: {
      required: true,
      type: 'url',
      maxLength: 2048,
      sanitize: { allowHTML: false, allowSQL: false }
    },
    email: {
      required: true,
      type: 'email',
      maxLength: 254,
      sanitize: { allowHTML: false, allowSQL: false }
    },
    domain: {
      required: true,
      type: 'domain',
      maxLength: 253,
      sanitize: { allowHTML: false, allowSQL: false }
    }
  },
  
  // Malware Analysis
  malware: {
    hash: {
      required: true,
      type: 'hash',
      sanitize: { allowHTML: false, allowSQL: false }
    },
    filePath: {
      required: true,
      pattern: VALIDATION_PATTERNS.FILE_PATH,
      maxLength: 260,
      sanitize: { allowHTML: false, allowSQL: false }
    },
    process: {
      required: true,
      type: 'process',
      maxLength: 255,
      sanitize: { allowHTML: false, allowSQL: false }
    }
  },
  
  // Network Security
  network: {
    ip: {
      required: true,
      type: 'ip',
      sanitize: { allowHTML: false, allowSQL: false }
    },
    port: {
      required: true,
      pattern: /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/,
      message: 'Please enter a valid port number (1-65535)'
    }
  },
  
  // Cryptocurrency
  crypto: {
    address: {
      required: true,
      type: 'crypto',
      sanitize: { allowHTML: false, allowSQL: false }
    },
    amount: {
      required: true,
      pattern: /^\d+(\.\d{1,8})?$/,
      message: 'Please enter a valid amount (up to 8 decimal places)'
    }
  },
  
  // General
  general: {
    text: {
      required: true,
      minLength: 1,
      maxLength: 1000,
      pattern: VALIDATION_PATTERNS.NO_SPECIAL_CHARS,
      sanitize: { allowHTML: false, allowSQL: false }
    },
    search: {
      required: true,
      minLength: 2,
      maxLength: 100,
      sanitize: { allowHTML: false, allowSQL: false }
    }
  }
};
