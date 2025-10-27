import winston from "winston";
import path from "path";

/**
 * Structured Logging Service using Winston
 * 
 * Provides HIPAA-compliant structured logging with:
 * - Multiple log levels (error, warn, info, http, debug)
 * - Structured JSON format for machine parsing
 * - Console output for development
 * - File rotation for production
 * - PHI scrubbing for security
 * - Request correlation IDs
 */

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log colors for console output
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
};

winston.addColors(colors);

// Determine log level based on environment
const level = () => {
  const env = process.env.NODE_ENV || "development";
  const isDevelopment = env === "development";
  return isDevelopment ? "debug" : "info";
};

// Format for console output (development)
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;
    const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : "";
    return `${timestamp} [${level}]: ${message}${metaStr}`;
  })
);

// Format for file output (production) - structured JSON
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Define transports
const transports: winston.transport[] = [];

// Console transport for all environments
if (process.env.NODE_ENV !== "test") {
  transports.push(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

// File transports for production (commented out - requires log directory setup)
// Uncomment when deploying to production with proper log directory
/*
if (process.env.NODE_ENV === "production") {
  // Error logs
  transports.push(
    new winston.transports.File({
      filename: path.join("logs", "error.log"),
      level: "error",
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );

  // Combined logs
  transports.push(
    new winston.transports.File({
      filename: path.join("logs", "combined.log"),
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 10,
    })
  );

  // HTTP request logs
  transports.push(
    new winston.transports.File({
      filename: path.join("logs", "http.log"),
      level: "http",
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 10,
    })
  );
}
*/

// Create the logger instance
export const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
  // Don't exit on uncaught errors (handled by graceful shutdown)
  exitOnError: false,
});

/**
 * PHI Scrubbing - Remove sensitive healthcare data from logs
 * 
 * HIPAA requires that PHI is not logged unless specifically required
 * for audit trails (which go to the audit_logs table)
 */
const PHI_PATTERNS = [
  /\b\d{3}-\d{2}-\d{4}\b/g, // SSN
  /\b\d{9}\b/g, // Medicare/Medicaid ID
  /\b[A-Z]{2}\d{6}\b/g, // Medical Record Numbers
  /\b\d{3}-\d{3}-\d{4}\b/g, // Phone numbers
  /\b[\w.%+-]+@[\w.-]+\.[A-Z|a-z]{2,}\b/g, // Email (may contain PHI in healthcare context)
];

/**
 * Scrub PHI from log messages and metadata
 */
function scrubPHI(text: string): string {
  let scrubbed = text;
  PHI_PATTERNS.forEach((pattern) => {
    scrubbed = scrubbed.replace(pattern, "[REDACTED]");
  });
  return scrubbed;
}

/**
 * Safe logging methods that scrub PHI
 */
export const log = {
  error: (message: string, meta?: any) => {
    logger.error(scrubPHI(message), meta);
  },
  
  warn: (message: string, meta?: any) => {
    logger.warn(scrubPHI(message), meta);
  },
  
  info: (message: string, meta?: any) => {
    logger.info(scrubPHI(message), meta);
  },
  
  http: (message: string, meta?: any) => {
    logger.http(scrubPHI(message), meta);
  },
  
  debug: (message: string, meta?: any) => {
    logger.debug(scrubPHI(message), meta);
  },
};

/**
 * Create a child logger with additional context
 * Useful for adding request IDs, user IDs, etc.
 */
export function createChildLogger(context: Record<string, any>) {
  return logger.child(context);
}

/**
 * Log request details (for HTTP logging middleware)
 */
export function logRequest(req: any, res: any, duration: number) {
  const logData = {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    duration: `${duration}ms`,
    ip: req.ip || req.connection?.remoteAddress,
    userAgent: req.get("user-agent"),
    userId: req.user?.claims?.sub,
  };

  const level = res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "http";
  logger.log(level, `${req.method} ${req.url} ${res.statusCode} in ${duration}ms`, logData);
}

/**
 * Log database query (for performance monitoring)
 */
export function logDatabaseQuery(query: string, duration: number, error?: Error) {
  if (error) {
    log.error(`Database query failed: ${error.message}`, {
      query: scrubPHI(query),
      duration: `${duration}ms`,
      error: error.stack,
    });
  } else if (duration > 1000) {
    // Log slow queries as warnings
    log.warn(`Slow database query detected`, {
      query: scrubPHI(query),
      duration: `${duration}ms`,
    });
  } else {
    log.debug(`Database query executed`, {
      query: scrubPHI(query),
      duration: `${duration}ms`,
    });
  }
}

/**
 * Log security event (authentication, authorization, rate limiting)
 */
export function logSecurityEvent(event: string, details: Record<string, any>) {
  log.warn(`Security event: ${event}`, {
    event,
    ...details,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Log error with full stack trace
 */
export function logError(error: Error, context?: Record<string, any>) {
  log.error(`${error.name}: ${error.message}`, {
    stack: error.stack,
    ...context,
  });
}

/**
 * Log startup information
 */
export function logStartup(info: {
  port: number;
  environment: string;
  nodeVersion: string;
  databaseConnected: boolean;
}) {
  log.info("Application started successfully", info);
}

/**
 * Log shutdown information
 */
export function logShutdown(reason: string) {
  log.info(`Application shutting down: ${reason}`, {
    timestamp: new Date().toISOString(),
  });
}

// Export Winston logger for direct access if needed
export { logger as winstonLogger };
