import os from "os";
import { db } from "./db";

/**
 * Metrics Collection Service
 * 
 * Provides comprehensive metrics for monitoring:
 * - System health (CPU, memory, uptime)
 * - API performance (request counts, response times, error rates)
 * - Database connection health
 */

interface RequestMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  avgResponseTime: number;
  requestsByEndpoint: Record<string, number>;
  requestsByMethod: Record<string, number>;
  errorsByStatusCode: Record<string, number>;
}

interface SystemMetrics {
  uptime: number;
  memory: {
    total: number;
    used: number;
    free: number;
    usagePercentage: number;
  };
  cpu: {
    cores: number;
    loadAverage: number[];
    model: string;
  };
  process: {
    memoryUsage: NodeJS.MemoryUsage;
    uptime: number;
    pid: number;
  };
}

interface DatabaseMetrics {
  isConnected: boolean;
  connectionPoolSize?: number;
  activeConnections?: number;
  idleConnections?: number;
  lastQueryTime?: number;
}

// In-memory metrics storage (replace with Redis in production)
class MetricsCollector {
  private requestMetrics: RequestMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    avgResponseTime: 0,
    requestsByEndpoint: {},
    requestsByMethod: {},
    errorsByStatusCode: {},
  };

  private responseTimes: number[] = [];
  private readonly MAX_RESPONSE_TIMES = 1000; // Keep last 1000 response times
  private startTime = Date.now();

  recordRequest(method: string, endpoint: string, statusCode: number, responseTime: number) {
    this.requestMetrics.totalRequests++;

    if (statusCode >= 200 && statusCode < 400) {
      this.requestMetrics.successfulRequests++;
    } else {
      this.requestMetrics.failedRequests++;
      this.requestMetrics.errorsByStatusCode[statusCode] = 
        (this.requestMetrics.errorsByStatusCode[statusCode] || 0) + 1;
    }

    // Track by method
    this.requestMetrics.requestsByMethod[method] = 
      (this.requestMetrics.requestsByMethod[method] || 0) + 1;

    // Track by endpoint (normalize dynamic IDs)
    const normalizedEndpoint = this.normalizeEndpoint(endpoint);
    this.requestMetrics.requestsByEndpoint[normalizedEndpoint] = 
      (this.requestMetrics.requestsByEndpoint[normalizedEndpoint] || 0) + 1;

    // Track response time
    this.responseTimes.push(responseTime);
    if (this.responseTimes.length > this.MAX_RESPONSE_TIMES) {
      this.responseTimes.shift();
    }

    // Update average response time
    this.requestMetrics.avgResponseTime = 
      this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
  }

  private normalizeEndpoint(endpoint: string): string {
    // Replace UUIDs and numbers with placeholders
    return endpoint
      .replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:id')
      .replace(/\/\d+/g, '/:id');
  }

  getRequestMetrics(): RequestMetrics {
    return { ...this.requestMetrics };
  }

  getSystemMetrics(): SystemMetrics {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    return {
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      memory: {
        total: totalMem,
        used: usedMem,
        free: freeMem,
        usagePercentage: (usedMem / totalMem) * 100,
      },
      cpu: {
        cores: os.cpus().length,
        loadAverage: os.loadavg(),
        model: os.cpus()[0]?.model || 'Unknown',
      },
      process: {
        memoryUsage: process.memoryUsage(),
        uptime: Math.floor(process.uptime()),
        pid: process.pid,
      },
    };
  }

  async getDatabaseMetrics(): Promise<DatabaseMetrics> {
    try {
      // Test database connection with a simple query
      const startTime = Date.now();
      await db.execute('SELECT 1');
      const queryTime = Date.now() - startTime;

      return {
        isConnected: true,
        lastQueryTime: queryTime,
      };
    } catch (error) {
      return {
        isConnected: false,
      };
    }
  }

  getResponseTimePercentiles() {
    if (this.responseTimes.length === 0) {
      return { p50: 0, p95: 0, p99: 0 };
    }

    const sorted = [...this.responseTimes].sort((a, b) => a - b);
    const p50Index = Math.floor(sorted.length * 0.5);
    const p95Index = Math.floor(sorted.length * 0.95);
    const p99Index = Math.floor(sorted.length * 0.99);

    return {
      p50: sorted[p50Index] || 0,
      p95: sorted[p95Index] || 0,
      p99: sorted[p99Index] || 0,
    };
  }

  reset() {
    this.requestMetrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      avgResponseTime: 0,
      requestsByEndpoint: {},
      requestsByMethod: {},
      errorsByStatusCode: {},
    };
    this.responseTimes = [];
  }
}

// Export singleton instance
export const metricsCollector = new MetricsCollector();

/**
 * Get comprehensive metrics for monitoring
 */
export async function getAllMetrics() {
  const [requestMetrics, systemMetrics, databaseMetrics, percentiles] = await Promise.all([
    Promise.resolve(metricsCollector.getRequestMetrics()),
    Promise.resolve(metricsCollector.getSystemMetrics()),
    metricsCollector.getDatabaseMetrics(),
    Promise.resolve(metricsCollector.getResponseTimePercentiles()),
  ]);

  return {
    timestamp: new Date().toISOString(),
    requests: {
      ...requestMetrics,
      percentiles,
    },
    system: systemMetrics,
    database: databaseMetrics,
  };
}

/**
 * Export metrics in Prometheus format for monitoring systems
 */
export async function getPrometheusMetrics() {
  const metrics = await getAllMetrics();
  const lines: string[] = [];

  // Helper to add metric
  const addMetric = (name: string, value: number, help: string, type = 'gauge') => {
    lines.push(`# HELP ${name} ${help}`);
    lines.push(`# TYPE ${name} ${type}`);
    lines.push(`${name} ${value}`);
  };

  // Request metrics
  addMetric('http_requests_total', metrics.requests.totalRequests, 'Total HTTP requests', 'counter');
  addMetric('http_requests_successful', metrics.requests.successfulRequests, 'Successful HTTP requests', 'counter');
  addMetric('http_requests_failed', metrics.requests.failedRequests, 'Failed HTTP requests', 'counter');
  addMetric('http_response_time_avg', metrics.requests.avgResponseTime, 'Average response time in ms');
  addMetric('http_response_time_p50', metrics.requests.percentiles.p50, '50th percentile response time');
  addMetric('http_response_time_p95', metrics.requests.percentiles.p95, '95th percentile response time');
  addMetric('http_response_time_p99', metrics.requests.percentiles.p99, '99th percentile response time');

  // System metrics
  addMetric('system_uptime_seconds', metrics.system.uptime, 'System uptime in seconds');
  addMetric('system_memory_total_bytes', metrics.system.memory.total, 'Total system memory');
  addMetric('system_memory_used_bytes', metrics.system.memory.used, 'Used system memory');
  addMetric('system_memory_usage_percent', metrics.system.memory.usagePercentage, 'Memory usage percentage');
  addMetric('system_cpu_cores', metrics.system.cpu.cores, 'Number of CPU cores');
  addMetric('system_cpu_load_1m', metrics.system.cpu.loadAverage[0] || 0, '1-minute load average');
  addMetric('system_cpu_load_5m', metrics.system.cpu.loadAverage[1] || 0, '5-minute load average');
  addMetric('system_cpu_load_15m', metrics.system.cpu.loadAverage[2] || 0, '15-minute load average');

  // Process metrics
  addMetric('process_uptime_seconds', metrics.system.process.uptime, 'Process uptime in seconds');
  addMetric('process_memory_heap_used_bytes', metrics.system.process.memoryUsage.heapUsed, 'Process heap memory used');
  addMetric('process_memory_heap_total_bytes', metrics.system.process.memoryUsage.heapTotal, 'Process heap memory total');
  addMetric('process_memory_rss_bytes', metrics.system.process.memoryUsage.rss, 'Process RSS memory');

  // Database metrics
  addMetric('database_connected', metrics.database.isConnected ? 1 : 0, 'Database connection status');
  if (metrics.database.lastQueryTime !== undefined) {
    addMetric('database_last_query_time_ms', metrics.database.lastQueryTime, 'Last database query time in ms');
  }

  return lines.join('\n');
}
