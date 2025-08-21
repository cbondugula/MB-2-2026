import { Request, Response, NextFunction } from 'express'
import { logger } from './logging'

// Performance metrics storage
interface PerformanceMetrics {
  endpoint: string
  method: string
  duration: number
  statusCode: number
  timestamp: Date
  memoryUsage: NodeJS.MemoryUsage
  cpuUsage?: NodeJS.CpuUsage
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = []
  private readonly maxMetrics = 1000
  private alertThresholds = {
    responseTime: 2000, // 2 seconds
    memoryUsage: 500 * 1024 * 1024, // 500MB
    errorRate: 0.05 // 5%
  }

  recordMetric(metric: PerformanceMetrics) {
    this.metrics.push(metric)
    
    // Keep only the most recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics)
    }

    // Check for performance alerts
    this.checkAlerts(metric)
  }

  private checkAlerts(metric: PerformanceMetrics) {
    // Alert on slow response times
    if (metric.duration > this.alertThresholds.responseTime) {
      logger.warn('Performance Alert: Slow Response Time', {
        endpoint: metric.endpoint,
        method: metric.method,
        duration: metric.duration,
        threshold: this.alertThresholds.responseTime,
        type: 'performance_alert'
      })
    }

    // Alert on high memory usage
    const memoryUsageMB = metric.memoryUsage.heapUsed
    if (memoryUsageMB > this.alertThresholds.memoryUsage) {
      logger.warn('Performance Alert: High Memory Usage', {
        memoryUsage: `${Math.round(memoryUsageMB / 1024 / 1024)}MB`,
        threshold: `${Math.round(this.alertThresholds.memoryUsage / 1024 / 1024)}MB`,
        endpoint: metric.endpoint,
        type: 'memory_alert'
      })
    }

    // Alert on error rates
    const recentMetrics = this.getRecentMetrics(5 * 60 * 1000) // Last 5 minutes
    const errorRate = this.calculateErrorRate(recentMetrics)
    
    if (errorRate > this.alertThresholds.errorRate) {
      logger.error('Performance Alert: High Error Rate', {
        errorRate: `${Math.round(errorRate * 100)}%`,
        threshold: `${Math.round(this.alertThresholds.errorRate * 100)}%`,
        recentRequests: recentMetrics.length,
        type: 'error_rate_alert'
      })
    }
  }

  getRecentMetrics(timeWindowMs: number): PerformanceMetrics[] {
    const cutoff = new Date(Date.now() - timeWindowMs)
    return this.metrics.filter(m => m.timestamp >= cutoff)
  }

  calculateErrorRate(metrics: PerformanceMetrics[]): number {
    if (metrics.length === 0) return 0
    
    const errorCount = metrics.filter(m => m.statusCode >= 400).length
    return errorCount / metrics.length
  }

  getAverageResponseTime(endpoint?: string): number {
    let relevantMetrics = this.metrics
    
    if (endpoint) {
      relevantMetrics = this.metrics.filter(m => m.endpoint === endpoint)
    }

    if (relevantMetrics.length === 0) return 0
    
    const totalDuration = relevantMetrics.reduce((sum, m) => sum + m.duration, 0)
    return Math.round(totalDuration / relevantMetrics.length)
  }

  getHealthSummary() {
    const recentMetrics = this.getRecentMetrics(15 * 60 * 1000) // Last 15 minutes
    
    return {
      totalRequests: recentMetrics.length,
      averageResponseTime: this.getAverageResponseTime(),
      errorRate: Math.round(this.calculateErrorRate(recentMetrics) * 100),
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      alerts: {
        slowRequests: recentMetrics.filter(m => m.duration > this.alertThresholds.responseTime).length,
        memoryAlerts: recentMetrics.filter(m => m.memoryUsage.heapUsed > this.alertThresholds.memoryUsage).length,
        errorAlerts: this.calculateErrorRate(recentMetrics) > this.alertThresholds.errorRate ? 1 : 0
      }
    }
  }

  getEndpointStats() {
    const stats: { [endpoint: string]: any } = {}
    
    for (const metric of this.metrics) {
      const key = `${metric.method} ${metric.endpoint}`
      
      if (!stats[key]) {
        stats[key] = {
          endpoint: metric.endpoint,
          method: metric.method,
          count: 0,
          totalDuration: 0,
          errors: 0,
          lastAccessed: metric.timestamp
        }
      }
      
      stats[key].count++
      stats[key].totalDuration += metric.duration
      stats[key].lastAccessed = metric.timestamp
      
      if (metric.statusCode >= 400) {
        stats[key].errors++
      }
    }
    
    // Calculate averages and error rates
    return Object.values(stats).map((stat: any) => ({
      ...stat,
      averageResponseTime: Math.round(stat.totalDuration / stat.count),
      errorRate: Math.round((stat.errors / stat.count) * 100)
    }))
  }
}

export const performanceMonitor = new PerformanceMonitor()

// Middleware for performance monitoring
export const monitorPerformance = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()
  const startCpuUsage = process.cpuUsage()
  
  // Capture response metrics when request finishes
  res.on('finish', () => {
    const duration = Date.now() - start
    const endCpuUsage = process.cpuUsage(startCpuUsage)
    
    const metric: PerformanceMetrics = {
      endpoint: req.route?.path || req.path,
      method: req.method,
      duration,
      statusCode: res.statusCode,
      timestamp: new Date(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: endCpuUsage
    }
    
    performanceMonitor.recordMetric(metric)
  })
  
  next()
}

// API endpoints for performance monitoring
export const getPerformanceHealth = (req: Request, res: Response) => {
  const health = performanceMonitor.getHealthSummary()
  res.json(health)
}

export const getPerformanceStats = (req: Request, res: Response) => {
  const stats = performanceMonitor.getEndpointStats()
  res.json({
    endpoints: stats,
    summary: performanceMonitor.getHealthSummary(),
    timestamp: new Date().toISOString()
  })
}