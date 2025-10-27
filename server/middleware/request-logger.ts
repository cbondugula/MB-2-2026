import type { Request, Response, NextFunction } from "express";
import { logRequest, logSecurityEvent } from "../logger";
import { metricsCollector } from "../metrics";
import { nanoid } from "nanoid";

/**
 * HTTP Request Logging Middleware
 * 
 * Logs all HTTP requests with:
 * - Request method, URL, status code
 * - Response time
 * - User information (if authenticated)
 * - Request correlation ID for tracing
 * - Security events (rate limiting, auth failures)
 */

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      startTime?: number;
    }
  }
}

/**
 * Add correlation ID and start time to request
 */
export function requestContextMiddleware(req: Request, res: Response, next: NextFunction) {
  // Generate unique request ID for correlation
  req.requestId = nanoid();
  req.startTime = Date.now();
  
  // Add request ID to response headers for client tracking
  res.setHeader("X-Request-ID", req.requestId);
  
  next();
}

/**
 * Log HTTP request after response is sent
 */
export function httpLoggingMiddleware(req: Request, res: Response, next: NextFunction) {
  // Listen for response finish event
  res.on("finish", () => {
    const duration = req.startTime ? Date.now() - req.startTime : 0;
    
    // Collect metrics (strip query strings to prevent unbounded cardinality)
    const urlWithoutQuery = req.originalUrl?.split('?')[0] || req.url.split('?')[0] || req.url;
    metricsCollector.recordRequest(req.method, urlWithoutQuery, res.statusCode, duration);
    
    // Log the request
    logRequest(req, res, duration);
    
    // Log security events
    if (res.statusCode === 401) {
      logSecurityEvent("Unauthorized access attempt", {
        method: req.method,
        url: req.url,
        ip: req.ip,
        requestId: req.requestId,
      });
    }
    
    if (res.statusCode === 403) {
      logSecurityEvent("Forbidden access attempt", {
        method: req.method,
        url: req.url,
        ip: req.ip,
        requestId: req.requestId,
      });
    }
    
    if (res.statusCode === 429) {
      logSecurityEvent("Rate limit exceeded", {
        method: req.method,
        url: req.url,
        ip: req.ip,
        requestId: req.requestId,
      });
    }
  });
  
  next();
}

/**
 * Error logging middleware (should be last in chain)
 */
export function errorLoggingMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  const { logError } = require("../logger");
  
  // Log the error with request context
  logError(err, {
    method: req.method,
    url: req.url,
    requestId: req.requestId,
    userId: (req as any).user?.claims?.sub,
    ip: req.ip,
  });
  
  next(err);
}
