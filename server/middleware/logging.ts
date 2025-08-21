import winston from 'winston'
import morgan from 'morgan'

// Configure Winston Logger
export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { 
    service: 'medbuilder-platform',
    version: '1.0.0'
  },
  transports: [
    // Write all logs error (and below) to error.log
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // Write all logs info (and below) to combined.log
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),

    // Write to console in development
    ...(process.env.NODE_ENV !== 'production' ? [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    ] : [])
  ]
})

// Create logs directory if it doesn't exist
import fs from 'fs'
import path from 'path'

const logsDir = path.join(process.cwd(), 'logs')
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

// Morgan HTTP request logging
export const httpLogger = morgan('combined', {
  stream: {
    write: (message: string) => {
      logger.info(message.trim(), { type: 'http_request' })
    }
  }
})

// Error logging middleware
export const errorLogger = (err: any, req: any, res: any, next: any) => {
  logger.error('Unhandled error', {
    error: {
      message: err.message,
      stack: err.stack,
      code: err.code,
      status: err.status
    },
    request: {
      method: req.method,
      url: req.url,
      headers: req.headers,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    },
    timestamp: new Date().toISOString()
  })
  
  next(err)
}

// Performance monitoring
export const performanceLogger = (req: any, res: any, next: any) => {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - start
    
    // Log slow requests (>1000ms)
    if (duration > 1000) {
      logger.warn('Slow request detected', {
        method: req.method,
        url: req.url,
        duration: `${duration}ms`,
        statusCode: res.statusCode,
        type: 'performance'
      })
    }
    
    // Log performance metrics
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      duration: `${duration}ms`,
      statusCode: res.statusCode,
      contentLength: res.get('content-length') || 0,
      type: 'performance'
    })
  })
  
  next()
}