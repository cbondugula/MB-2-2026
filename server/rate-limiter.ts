/**
 * Rate Limiting Middleware - HIPAA-compliant API protection
 * Prevents DDoS attacks, brute force, and resource abuse
 */

import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import type { Request } from 'express';

// Custom key generator to use authenticated user ID when available
const keyGenerator = (req: Request): string => {
  // Use authenticated user ID if available (more accurate than IP)
  const user = req.user as any; // Replit Auth user object
  if (user?.sub || user?.id) {
    return `user:${user.sub || user.id}`;
  }
  
  // Fallback to IP address for unauthenticated requests (IPv6-safe)
  return ipKeyGenerator(req.ip || req.socket.remoteAddress || 'unknown');
};

// Skip rate limiting in development for testing
const skipRateLimitInDevelopment = process.env.NODE_ENV === 'development';

// Standard message for rate limit exceeded
const standardMessage = {
  error: "Too many requests from this user/IP, please try again later.",
  retryAfter: "Check the Retry-After header for wait time"
};

/**
 * Strict rate limiting for authentication endpoints
 * Prevents brute force attacks on login/password reset
 * HIPAA: Protects against unauthorized PHI access attempts
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    error: "Too many authentication attempts, please try again after 15 minutes.",
    security: "Multiple failed attempts have been logged for security review."
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  skip: () => skipRateLimitInDevelopment,
  // Custom handler for auth-specific logging
  handler: (req, res) => {
    console.warn(`[SECURITY] Rate limit exceeded for auth endpoint: ${req.path} from ${keyGenerator(req)}`);
    res.status(429).json({
      error: "Too many authentication attempts",
      retryAfter: res.getHeader('Retry-After'),
      blocked: true
    });
  }
});

/**
 * AI/Code Generation rate limiting
 * Expensive operations require stricter limits
 * Prevents resource exhaustion from AI API costs
 */
export const aiGenerationRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: {
    error: "AI generation rate limit exceeded. Please wait before generating more code.",
    limit: "10 requests per minute"
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  skipSuccessfulRequests: false,
  // Skip rate limit for premium users (if implemented) or in development
  skip: (req) => {
    if (skipRateLimitInDevelopment) return true;
    // Future: Check if user has premium plan
    // return req.user?.plan === 'enterprise';
    return false;
  }
});

/**
 * Chat message rate limiting
 * Prevents spam and abuse of chat system
 */
export const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute  
  max: 30, // 30 messages per minute
  message: {
    error: "Too many chat messages, please slow down.",
    limit: "30 messages per minute"
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  skip: () => skipRateLimitInDevelopment
});

/**
 * API read operations rate limiting
 * More relaxed for GET requests
 */
export const apiReadRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: standardMessage,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  skip: () => skipRateLimitInDevelopment
});

/**
 * API write operations rate limiting
 * Stricter for POST/PUT/PATCH/DELETE
 * Protects database from write flooding
 */
export const apiWriteRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 write requests per minute
  message: {
    error: "Too many write operations, please slow down.",
    limit: "30 write requests per minute"
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  skip: () => skipRateLimitInDevelopment
});

/**
 * File upload rate limiting
 * Prevents storage abuse
 */
export const uploadRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 uploads per minute
  message: {
    error: "Too many file uploads, please wait before uploading more files.",
    limit: "10 uploads per minute"
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator
});

/**
 * Webhook rate limiting
 * Protects against webhook spam
 */
export const webhookRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 webhook calls per minute
  message: {
    error: "Webhook rate limit exceeded",
    limit: "60 requests per minute"
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Use webhook source IP for rate limiting (IPv6-safe)
  keyGenerator: (req) => {
    const forwardedFor = req.headers['x-forwarded-for'];
    if (typeof forwardedFor === 'string') {
      const clientIp = forwardedFor.split(',')[0].trim();
      return ipKeyGenerator(clientIp);
    }
    return ipKeyGenerator(req.ip || 'unknown');
  }
});

/**
 * Global fallback rate limiter
 * Catches all other endpoints
 */
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per 15 minutes
  message: {
    error: "Global rate limit exceeded. You've made too many requests.",
    limit: "1000 requests per 15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  skip: () => skipRateLimitInDevelopment
});

/**
 * Rate limiter bypass for health checks and monitoring
 */
export const healthCheckExemption = [
  '/health',
  '/api/health',
  '/ping',
  '/_health'
];

/**
 * Apply rate limiting based on endpoint type
 */
export function getRateLimiterForPath(path: string): any {
  // Health checks - no rate limiting
  if (healthCheckExemption.some(exempt => path.startsWith(exempt))) {
    return null;
  }
  
  // Authentication endpoints
  if (path.includes('/auth/') || path.includes('/login') || path.includes('/register')) {
    return authRateLimiter;
  }
  
  // AI generation endpoints
  if (path.includes('/generate') || path.includes('/ai/') || path.includes('/chat-to-code')) {
    return aiGenerationRateLimiter;
  }
  
  // Chat endpoints
  if (path.includes('/chat/') || path.includes('/messages')) {
    return chatRateLimiter;
  }
  
  // Upload endpoints
  if (path.includes('/upload') || path.includes('/file')) {
    return uploadRateLimiter;
  }
  
  // Webhook endpoints
  if (path.includes('/webhook')) {
    return webhookRateLimiter;
  }
  
  // Default: Use method-based rate limiting
  return null; // Let global middleware handle it
};
