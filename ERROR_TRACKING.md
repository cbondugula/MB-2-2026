# Error Tracking & Alerting Infrastructure

## Overview
Comprehensive error tracking and alerting system for MedBuilder platform leveraging Winston structured logging, metrics collection, and health monitoring.

## Current Implementation

### 1. Structured Error Logging (Winston)

All errors are logged with structured JSON output for machine parsing:

**Error Types Tracked:**
- Application errors (500-level responses)
- Authentication failures (401)
- Authorization failures (403)
- Rate limit violations (429)
- Database connection errors
- Uncaught exceptions
- Unhandled promise rejections

**Log Format:**
```json
{
  "level": "error",
  "message": "Database query failed",
  "timestamp": "2025-10-27T05:50:00.000Z",
  "stack": "Error: Connection timeout\n    at ...",
  "context": {
    "method": "GET",
    "url": "/api/projects",
    "requestId": "abc123xyz",
    "userId": "user_12345",
    "ip": "10.82.9.122"
  }
}
```

### 2. Security Event Logging

**Tracked Security Events:**
- Unauthorized access attempts (401)
- Forbidden access attempts (403)
- Rate limit exceeded (429)
- Authentication failures
- Suspicious activity patterns

**Security Log Format:**
```json
{
  "level": "warn",
  "message": "Security event: Rate limit exceeded",
  "timestamp": "2025-10-27T05:50:00.000Z",
  "event": "Rate limit exceeded",
  "method": "POST",
  "url": "/api/chat",
  "ip": "10.82.9.122",
  "requestId": "xyz789abc"
}
```

### 3. Request Correlation

Every request gets a unique correlation ID for tracing:
```
X-Request-ID: QuRZ3Y8Mg8w9oB7hBhkJ4
```

This allows:
- Tracing errors across distributed systems
- Following request flow through microservices
- Correlating logs with metrics
- Debugging complex interactions

### 4. Error Metrics Collection

Errors are automatically tracked in metrics:
```json
{
  "requests": {
    "failedRequests": 50,
    "errorsByStatusCode": {
      "401": 15,
      "403": 5,
      "404": 20,
      "500": 8,
      "429": 2
    }
  }
}
```

Access via:
```bash
curl http://localhost:5000/metrics | jq '.requests.errorsByStatusCode'
```

### 5. Health Check Error Detection

Health checks monitor:
- Database connectivity
- Memory pressure
- Encryption service availability
- Application liveness

See [DEPLOYMENT.md](./DEPLOYMENT.md) for details.

## Log Files & Output

### Development (Console)
Logs output to console with formatting:
```bash
2025-10-27 05:50:00:000 [error]: Database connection failed
{
  "message": "Connection timeout",
  "stack": "...",
  "context": {...}
}
```

### Production (File-Based)
Configure file logging for production:

```typescript
// In server/logger.ts, uncomment file transport:
new winston.transports.File({
  filename: '/var/log/medbuilder/error.log',
  level: 'error',
  format: format.combine(
    format.timestamp(),
    format.json()
  )
}),
new winston.transports.File({
  filename: '/var/log/medbuilder/combined.log',
  format: format.combine(
    format.timestamp(),
    format.json()
  )
})
```

**Log Rotation:**
```bash
# /etc/logrotate.d/medbuilder
/var/log/medbuilder/*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    create 0640 nodejs nodejs
    sharedscripts
    postrotate
        systemctl reload medbuilder
    endscript
}
```

## Alert Configuration

### Recommended Alerts

#### Critical Alerts (PagerDuty/OpsGenie)

1. **High Error Rate**
   ```yaml
   alert: HighErrorRate
   expr: (http_requests_failed / http_requests_total) > 0.05
   for: 5m
   labels:
     severity: critical
   annotations:
     summary: "Error rate above 5% for 5 minutes"
   ```

2. **Database Down**
   ```yaml
   alert: DatabaseConnectionFailure
   expr: database_connected == 0
   for: 1m
   labels:
     severity: critical
   annotations:
     summary: "Database connection lost"
   ```

3. **Service Down**
   ```yaml
   alert: ServiceUnhealthy
   expr: up{job="medbuilder"} == 0
   for: 1m
   labels:
     severity: critical
   annotations:
     summary: "MedBuilder service is down"
   ```

#### Warning Alerts (Slack/Email)

1. **Slow Response Times**
   ```yaml
   alert: SlowResponseTimes
   expr: http_response_time_p95 > 1000
   for: 10m
   labels:
     severity: warning
   annotations:
     summary: "95th percentile response time >1s"
   ```

2. **High Memory Usage**
   ```yaml
   alert: HighMemoryUsage
   expr: system_memory_usage_percent > 80
   for: 10m
   labels:
     severity: warning
   annotations:
     summary: "Memory usage above 80%"
   ```

3. **Rate Limit Violations**
   ```yaml
   alert: FrequentRateLimiting
   expr: increase(http_requests_total{status="429"}[5m]) > 100
   for: 5m
   labels:
     severity: warning
   annotations:
     summary: "High rate of 429 errors"
   ```

### Alert Channels

**PagerDuty (Critical):**
- Database failures
- Service outages
- High error rates (>5%)
- Security breaches

**Slack (Warning):**
- Performance degradation
- Resource pressure
- Elevated error rates (2-5%)
- Rate limiting issues

**Email (Info):**
- Daily error summaries
- Weekly performance reports
- Monthly security audits

## Error Monitoring Tools

### Recommended Integrations

#### 1. Sentry
```bash
npm install @sentry/node
```

```typescript
// server/index.ts
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Error handler
app.use(Sentry.Handlers.errorHandler());
```

#### 2. Datadog
```bash
npm install dd-trace
```

```typescript
// Top of server/index.ts
import tracer from 'dd-trace';
tracer.init({
  logInjection: true,
  env: process.env.NODE_ENV,
  service: 'medbuilder'
});
```

#### 3. New Relic
```bash
npm install newrelic
```

```typescript
// Top of server/index.ts (must be first)
import 'newrelic';
```

### ELK Stack (Self-Hosted)

**Elasticsearch + Logstash + Kibana:**

1. **Logstash Config:**
```ruby
input {
  file {
    path => "/var/log/medbuilder/combined.log"
    codec => "json"
  }
}

filter {
  if [level] == "error" {
    mutate {
      add_tag => ["error"]
    }
  }
}

output {
  elasticsearch {
    hosts => ["localhost:9200"]
    index => "medbuilder-%{+YYYY.MM.dd}"
  }
}
```

2. **Kibana Dashboards:**
- Error rate over time
- Error breakdown by endpoint
- Top error messages
- Response time distributions

## Error Handling Best Practices

### 1. Structured Error Responses

```typescript
// Good - Structured error
res.status(500).json({
  error: {
    code: "DATABASE_CONNECTION_FAILED",
    message: "Unable to connect to database",
    requestId: req.requestId,
    timestamp: new Date().toISOString()
  }
});

// Bad - Unstructured error
res.status(500).send("Error!");
```

### 2. Error Context

Always include context when logging errors:

```typescript
logError(error, {
  method: req.method,
  url: req.url,
  requestId: req.requestId,
  userId: req.user?.id,
  ip: req.ip,
  userAgent: req.get('user-agent')
});
```

### 3. PHI Scrubbing

Never log PHI/PII in error messages:

```typescript
// Good
logError(error, { userId: user.id });

// Bad - Contains PHI
logError(error, { 
  patientName: patient.name,
  ssn: patient.ssn
});
```

### 4. Error Recovery

Implement graceful degradation:

```typescript
try {
  const data = await database.query(sql);
  return res.json(data);
} catch (error) {
  logError(error, { query: 'projects' });
  
  // Return cached data or graceful error
  const cached = await cache.get('projects');
  if (cached) {
    return res.json({ data: cached, source: 'cache' });
  }
  
  return res.status(503).json({
    error: "Service temporarily unavailable"
  });
}
```

## Monitoring Dashboards

### Key Metrics Dashboard

1. **Request Volume**
   - Requests per second
   - Success rate
   - Error rate by status code

2. **Performance**
   - Response time percentiles (p50, p95, p99)
   - Slowest endpoints
   - Database query times

3. **Errors**
   - Error count by endpoint
   - Error rate trend
   - Top error messages

4. **Security**
   - Failed auth attempts
   - Rate limit violations
   - Suspicious access patterns

### Health Dashboard

1. **System Health**
   - CPU usage
   - Memory usage
   - Disk I/O

2. **Application Health**
   - Process uptime
   - Heap memory
   - Active connections

3. **Database Health**
   - Connection status
   - Query latency
   - Connection pool usage

## Incident Response

### Error Severity Levels

**P0 (Critical):**
- Complete service outage
- Database unavailable
- Data loss
- Security breach

**P1 (High):**
- Partial service degradation
- High error rate (>5%)
- Performance issues affecting users

**P2 (Medium):**
- Non-critical feature broken
- Elevated error rate (2-5%)
- Resource warnings

**P3 (Low):**
- Minor bugs
- Low error rate (<2%)
- Feature requests

### Response Protocol

1. **Detection:**
   - Automated alerts trigger
   - User reports
   - Monitoring dashboards

2. **Triage:**
   - Assess severity
   - Identify affected users
   - Check correlation IDs

3. **Investigation:**
   - Review error logs
   - Check metrics
   - Examine stack traces

4. **Resolution:**
   - Apply fix
   - Deploy patch
   - Verify resolution

5. **Post-Mortem:**
   - Document incident
   - Root cause analysis
   - Preventive measures

## Future Enhancements

### 1. Real-Time Error Aggregation
- Implement error grouping by stack trace
- Deduplicate similar errors
- Track error frequency trends

### 2. Anomaly Detection
- ML-based anomaly detection
- Baseline error rates
- Automatic threshold adjustments

### 3. Distributed Tracing
- OpenTelemetry integration
- Cross-service request tracing
- Performance bottleneck identification

### 4. Error Replay
- Capture request context
- Reproduce errors locally
- Debug with full context

## Related Documentation
- [MONITORING.md](./MONITORING.md) - Metrics and observability
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Health checks and deployment
- [RATE_LIMITING.md](./RATE_LIMITING.md) - Rate limiting configuration
- `server/logger.ts` - Logging implementation
- `server/middleware/request-logger.ts` - Request logging middleware
