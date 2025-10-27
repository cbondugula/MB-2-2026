# Monitoring & Observability

## Overview
Comprehensive monitoring infrastructure for MedBuilder platform with structured logging, metrics collection, and health probes.

## Metrics Collection

### Endpoints

#### `/metrics` - JSON Metrics
Returns comprehensive metrics in JSON format:
```bash
curl http://localhost:5000/metrics
```

Response structure:
```json
{
  "timestamp": "2025-10-27T05:50:00.000Z",
  "requests": {
    "totalRequests": 1000,
    "successfulRequests": 950,
    "failedRequests": 50,
    "avgResponseTime": 45.2,
    "percentiles": {
      "p50": 35,
      "p95": 120,
      "p99": 250
    },
    "requestsByEndpoint": {
      "/api/projects": 200,
      "/api/chat/:id": 150
    },
    "requestsByMethod": {
      "GET": 700,
      "POST": 250,
      "PUT": 30,
      "DELETE": 20
    },
    "errorsByStatusCode": {
      "404": 25,
      "500": 15,
      "429": 10
    }
  },
  "system": {
    "uptime": 3600,
    "memory": {
      "total": 8589934592,
      "used": 2147483648,
      "free": 6442450944,
      "usagePercentage": 25.0
    },
    "cpu": {
      "cores": 4,
      "loadAverage": [1.2, 1.5, 1.8],
      "model": "Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz"
    },
    "process": {
      "memoryUsage": {
        "heapUsed": 52428800,
        "heapTotal": 104857600,
        "rss": 209715200
      },
      "uptime": 3600,
      "pid": 12345
    }
  },
  "database": {
    "isConnected": true,
    "lastQueryTime": 5
  }
}
```

#### `/metrics/prometheus` - Prometheus Format
Returns metrics in Prometheus text format for Grafana/Prometheus integration:
```bash
curl http://localhost:5000/metrics/prometheus
```

Response:
```
# HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
http_requests_total 1000

# HELP http_requests_successful Successful HTTP requests
# TYPE http_requests_successful counter
http_requests_successful 950

# HELP http_response_time_avg Average response time in ms
# TYPE http_response_time_avg gauge
http_response_time_avg 45.2

# HELP http_response_time_p95 95th percentile response time
# TYPE http_response_time_p95 gauge
http_response_time_p95 120

# HELP system_memory_usage_percent Memory usage percentage
# TYPE system_memory_usage_percent gauge
system_memory_usage_percent 25.0

# HELP database_connected Database connection status
# TYPE database_connected gauge
database_connected 1
```

### Metrics Collected

**Request Metrics:**
- Total requests
- Success/failure counts
- Average response time
- Response time percentiles (p50, p95, p99)
- Requests by endpoint (normalized)
- Requests by HTTP method
- Errors by status code

**System Metrics:**
- System uptime
- Memory usage (total, used, free, percentage)
- CPU information (cores, load average, model)
- Process memory (heap used, heap total, RSS)
- Process uptime and PID

**Database Metrics:**
- Connection status
- Last query response time

### Integration

The metrics collector is automatically integrated with all HTTP requests via middleware:
- Every request is tracked
- Response times are recorded
- Success/failure is logged
- Metrics are updated in real-time

### Rate Limiting Exemption

Metrics endpoints are exempt from rate limiting to ensure monitoring systems can always access them:
- `/metrics`
- `/metrics/prometheus`

## Health Checks

See [DEPLOYMENT.md](./DEPLOYMENT.md) for health check endpoints:
- `/health` - Comprehensive system health
- `/ready` - Readiness probe for load balancers
- `/live` - Liveness probe for orchestrators

## Structured Logging

Winston-based structured logging with:
- JSON output for machine parsing
- Multiple log levels (error, warn, info, http, debug)
- Request correlation IDs
- Security event tracking
- PHI scrubbing capability

See `server/logger.ts` for implementation details.

## Monitoring Best Practices

### Production Setup

1. **Metrics Scraping:**
   ```bash
   # Prometheus config (prometheus.yml)
   scrape_configs:
     - job_name: 'medbuilder'
       scrape_interval: 15s
       static_configs:
         - targets: ['medbuilder:5000']
       metrics_path: '/metrics/prometheus'
   ```

2. **Alerting Rules:**
   - High error rate (>5% 4xx/5xx responses)
   - Slow response times (p95 > 1000ms)
   - High memory usage (>80%)
   - Database connection failures
   - Rate limit violations

3. **Dashboards:**
   - Request rate and latency
   - Error rates by endpoint
   - System resource utilization
   - Database performance

### Development

Access metrics locally:
```bash
# JSON format
curl http://localhost:5000/metrics | jq '.'

# Prometheus format
curl http://localhost:5000/metrics/prometheus

# Health check
curl http://localhost:5000/health | jq '.'
```

## Infrastructure Requirements

### Current (In-Memory)
**Limitations:**
- Metrics stored in application memory
- **Resets on server restart** - All metrics lost, no persistence
- **Single-instance only** - Cannot aggregate across multiple server instances
- **No historical data** - Only tracks since last restart
- **No cross-instance visibility** - Each instance has its own metrics

**Important Notes:**
- Query strings are stripped before recording to prevent unbounded cardinality
- Endpoint normalization replaces IDs with `:id` placeholder (e.g., `/api/projects/123` → `/api/projects/:id`)
- Response times buffer capped at 1000 entries to prevent memory growth

### Future (Redis-Based)
For production deployment, migrate to Redis for:
- Distributed metrics across instances
- Historical metric storage
- Cross-instance aggregation
- Persistence across restarts

**Implementation:**
```typescript
// Replace in-memory storage with Redis
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

// Store metrics in Redis hashes
await redis.hincrby('metrics:requests', 'total', 1);
await redis.zadd('metrics:response_times', Date.now(), responseTime);
```

See [RATE_LIMITING.md](./RATE_LIMITING.md) for Redis setup guidance.

## Security Considerations

1. **Metrics Access:**
   - Metrics endpoints expose system information
   - Consider authentication in production
   - Or restrict to internal networks only

2. **Data Scrubbing:**
   - Endpoint paths are normalized (IDs replaced with :id)
   - No PHI/PII in metrics
   - User IDs are not exposed in metrics

3. **Rate Limiting:**
   - Metrics endpoints exempt from rate limiting
   - Required for monitoring system health
   - Internal network access recommended

## Troubleshooting

**Metrics not updating:**
- Check middleware integration
- Verify request logger is active
- Check Winston log output

**High memory usage:**
- Response times buffer capped at 1000 entries
- Metrics are aggregated, not detailed
- Consider Redis for large-scale deployments

**Database metrics failing:**
- Check database connection
- Verify DATABASE_URL environment variable
- Review database health check logs

## Related Documentation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Health checks and deployment
- [RATE_LIMITING.md](./RATE_LIMITING.md) - Rate limiting configuration
- `server/logger.ts` - Structured logging implementation
- `server/metrics.ts` - Metrics collection service
