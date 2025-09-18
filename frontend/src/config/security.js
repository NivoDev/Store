// Security configuration and utilities
export const SecurityConfig = {
  // Environment validation
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // API endpoints validation
  validateApiEndpoint(url) {
    if (!url) return false;
    
    // Only allow HTTPS in production
    if (this.isProduction && !url.startsWith('https://')) {
      console.warn('Security: HTTP endpoints not allowed in production');
      return false;
    }
    
    return true;
  },
  
  // Input sanitization
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    // Basic XSS prevention
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .trim();
  },
  
  // Email validation
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  },
  
  // Password strength validation
  validatePassword(password) {
    if (typeof password !== 'string') return false;
    
    return {
      isValid: password.length >= 6,
      hasMinLength: password.length >= 6,
      hasMaxLength: password.length <= 128,
      // Add more criteria as needed
      score: this.getPasswordScore(password)
    };
  },
  
  // Simple password scoring
  getPasswordScore(password) {
    let score = 0;
    
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    return score;
  },
  
  // Rate limiting helpers
  rateLimiter: {
    attempts: new Map(),
    
    canAttempt(key, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
      const now = Date.now();
      const attempts = this.attempts.get(key) || [];
      
      // Clean old attempts
      const validAttempts = attempts.filter(time => now - time < windowMs);
      
      if (validAttempts.length >= maxAttempts) {
        return false;
      }
      
      validAttempts.push(now);
      this.attempts.set(key, validAttempts);
      return true;
    },
    
    reset(key) {
      this.attempts.delete(key);
    }
  },
  
  // Session management
  session: {
    // Generate secure session ID
    generateId() {
      return 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
    },
    
    // Validate session data
    validate(sessionData) {
      if (!sessionData || typeof sessionData !== 'object') return false;
      
      const required = ['id', 'createdAt'];
      return required.every(field => sessionData.hasOwnProperty(field));
    },
    
    // Check if session is expired
    isExpired(sessionData, maxAgeMs = 24 * 60 * 60 * 1000) { // 24 hours default
      if (!sessionData.createdAt) return true;
      
      const age = Date.now() - new Date(sessionData.createdAt).getTime();
      return age > maxAgeMs;
    }
  },
  
  // Content Security Policy helpers
  csp: {
    // Generate nonce for inline scripts/styles
    generateNonce() {
      return btoa(Math.random().toString(36).substring(2, 15));
    },
    
    // Validate external resource URLs
    isAllowedResource(url, type) {
      const allowedDomains = {
        fonts: ['fonts.googleapis.com', 'fonts.gstatic.com'],
        images: ['*'], // Allow all HTTPS images
        scripts: ['fonts.googleapis.com'],
        styles: ['fonts.googleapis.com', 'fonts.gstatic.com']
      };
      
      const domains = allowedDomains[type] || [];
      if (domains.includes('*')) return true;
      
      try {
        const urlObj = new URL(url);
        return domains.some(domain => urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain));
      } catch {
        return false;
      }
    }
  },
  
  // Logging (safe for production)
  log: {
    security(message, data = {}) {
      if (SecurityConfig.isDevelopment) {
        console.warn('SECURITY:', message, data);
      }
      // In production, send to monitoring service
    },
    
    audit(action, userId = null, details = {}) {
      const logEntry = {
        timestamp: new Date().toISOString(),
        action,
        userId,
        details: SecurityConfig.isDevelopment ? details : '[REDACTED]',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'
      };
      
      if (SecurityConfig.isDevelopment) {
        console.log('AUDIT:', logEntry);
      }
      // In production, send to audit service
    }
  }
};

export default SecurityConfig;
