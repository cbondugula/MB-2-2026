# Deployment Infrastructure Guide

## Overview

MedBuilder includes production-ready deployment infrastructure with comprehensive health checks, readiness/liveness probes, and graceful shutdown handling for zero-downtime deployments.

## Health Check Endpoints

### 1. `/health` - Comprehensive System Health

**Purpose**: Detailed system health status for monitoring tools and dashboards

**Response** (200 OK - healthy, 503 Service Unavailable - unhealthy):
```json
{
  "status": "healthy|degraded|unhealthy",
  "timestamp": "2025-10-27T05:34:00.000Z",
  "uptime": 120,
  "checks": {
    "database": {
      "status": "connected|disconnected|error",
      "responseTime": 15
    },
    "encryption": {
      "enabled": false,
      "keySet": false,
      "keyValid": true,
      "testPassed": true,
      "algorithm": "aes-256-gcm",
      "keyLength": 32,
      "environment": "development"
    },
    "memory": {
      "used": 473,
      "total": 507,
      "percentage": 93
    }
  },
  "environment": "development"
}
```

**Status Determination**:
- **healthy**: All systems operational
- **degraded**: Database disconnected OR memory usage > 90%
- **unhealthy**: Database error OR server shutting down

**Use Cases**:
- Application monitoring dashboards (Datadog, New Relic)
- Automated alerting systems
- Health check aggregators
- Internal status pages

---

### 2. `/ready` - Readiness Probe

**Purpose**: Determines if the application is ready to serve traffic

**Response** (200 OK - ready, 503 Service Unavailable - not ready):
```json
{
  "ready": true,
  "timestamp": "2025-10-27T05:34:00.000Z",
  "checks": {
    "database": true,
    "server": true
  }
}
```

**Ready Criteria**:
- ✅ Database connection established
- ✅ Server not shutting down
- ✅ All critical dependencies initialized

**Use Cases**:
- **Load Balancer Health Checks**: Remove unhealthy instances from rotation
- **Kubernetes Readiness Probe**: Prevent traffic to unready pods
- **Auto-scaling Decisions**: Only scale based on ready instances
- **Blue-Green Deployments**: Verify new version ready before cutover

**Load Balancer Configuration Example**:
```yaml
# Kubernetes
readinessProbe:
  httpGet:
    path: /ready
    port: 5000
  initialDelaySeconds: 10
  periodSeconds: 5
  failureThreshold: 3
```

---

### 3. `/live` - Liveness Probe

**Purpose**: Determines if the application process is alive and responsive

**Response** (200 OK always - process is alive):
```json
{
  "alive": true,
  "timestamp": "2025-10-27T05:34:00.000Z",
  "uptime": 120
}
```

**Use Cases**:
- **Kubernetes Liveness Probe**: Restart unresponsive pods
- **Process Monitoring**: Detect application hangs/deadlocks
- **Container Orchestration**: Health monitoring for restarts

**Kubernetes Configuration Example**:
```yaml
livenessProbe:
  httpGet:
    path: /live
    port: 5000
  initialDelaySeconds: 30
  periodSeconds: 10
  failureThreshold: 3
```

---

## Graceful Shutdown

### Signal Handling

The application handles the following signals for graceful shutdown:

1. **SIGTERM** - Standard termination signal (Docker, Kubernetes)
2. **SIGINT** - Interrupt signal (Ctrl+C in development)
3. **Uncaught Exceptions** - Unhandled errors trigger graceful shutdown
4. **Unhandled Promise Rejections** - Rejected promises trigger graceful shutdown

### Shutdown Sequence

1. **Signal Received**
   ```
   SIGTERM received, starting graceful shutdown...
   ```

2. **Stop Accepting New Connections**
   - Server stops accepting new requests
   - Health checks return 503 (unhealthy)
   - Readiness probe returns 503 (not ready)
   - Liveness probe continues returning 200

3. **Grace Period (5 seconds)**
   - Allow ongoing requests to complete
   - Wait for database transactions to finish
   - Clean up resources

4. **Force Shutdown (30 second timeout)**
   - If graceful shutdown doesn't complete
   - Force exit to prevent indefinite hangs

### Implementation Details

**Location**: `server/index.ts`

```typescript
// Graceful shutdown handling
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});
```

---

## Deployment Best Practices

### 1. Zero-Downtime Deployments

**Rolling Updates**:
```yaml
# Kubernetes Deployment
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1
    maxUnavailable: 0
```

**Process**:
1. Deploy new version alongside old version
2. Wait for new pods to pass readiness checks (`/ready` returns 200)
3. Gradually shift traffic to new pods
4. Send SIGTERM to old pods
5. Wait for graceful shutdown (5s grace period)
6. Remove old pods

### 2. Health Check Monitoring

**Recommended Intervals**:
- `/health`: Every 30 seconds (monitoring systems)
- `/ready`: Every 5 seconds (load balancers)
- `/live`: Every 10 seconds (orchestrators)

**Alerting Thresholds**:
- `/health` unhealthy for > 1 minute → Page on-call
- `/ready` not ready for > 30 seconds → Auto-scale or restart
- `/live` not responding for > 30 seconds → Container restart

### 3. Resource Limits

**Recommended Settings**:
```yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "500m"
  limits:
    memory: "1Gi"
    cpu: "1000m"
```

**Memory Monitoring**:
- `/health` reports memory percentage
- Alert when memory > 90% (degraded status)
- Consider scaling or increasing limits

### 4. Logging During Deployment

**Startup Logs**:
```
serving on port 5000
```

**Shutdown Logs**:
```
SIGTERM received, starting graceful shutdown...
Server closed, cleaning up resources...
Graceful shutdown complete
```

**Forced Shutdown** (after 30s):
```
Forced shutdown after timeout
```

---

## Docker Configuration

### Dockerfile Example

```dockerfile
FROM node:20-slim

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --production

# Copy application
COPY . .

# Build application
RUN npm run build

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Expose port
EXPOSE 5000

# Start application
CMD ["npm", "start"]

# Handle shutdown signals
STOPSIGNAL SIGTERM
```

### Docker Compose Example

```yaml
version: '3.8'
services:
  medbuilder:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 40s
    deploy:
      replicas: 3
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
```

---

## Kubernetes Configuration

### Complete Deployment Example

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: medbuilder
  labels:
    app: medbuilder
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: medbuilder
  template:
    metadata:
      labels:
        app: medbuilder
    spec:
      containers:
      - name: medbuilder
        image: medbuilder:latest
        ports:
        - containerPort: 5000
          name: http
          protocol: TCP
        
        # Health checks
        livenessProbe:
          httpGet:
            path: /live
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 3
          failureThreshold: 3
        
        readinessProbe:
          httpGet:
            path: /ready
            port: 5000
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        
        # Startup probe for slow-starting applications
        startupProbe:
          httpGet:
            path: /live
            port: 5000
          initialDelaySeconds: 0
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 12  # 60 seconds total
        
        # Resource limits
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        
        # Environment variables
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: medbuilder-secrets
              key: database-url
        
        # Graceful shutdown
        lifecycle:
          preStop:
            exec:
              command: ["sleep", "5"]
      
      # Graceful shutdown period
      terminationGracePeriodSeconds: 35  # 30s timeout + 5s buffer
---
apiVersion: v1
kind: Service
metadata:
  name: medbuilder
spec:
  selector:
    app: medbuilder
  ports:
  - protocol: TCP
    port: 80
    targetPort: 5000
  type: LoadBalancer
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: medbuilder-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: medbuilder
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

---

## Monitoring Integration

### Prometheus Metrics

Future enhancement: Add Prometheus `/metrics` endpoint

**Planned Metrics**:
- `http_requests_total` - Total HTTP requests
- `http_request_duration_seconds` - Request latency
- `database_query_duration_seconds` - Database query latency
- `active_connections` - Active WebSocket connections
- `memory_usage_bytes` - Memory consumption
- `graceful_shutdowns_total` - Shutdown counter

### Monitoring Tools Integration

**Datadog**:
```javascript
// Future: Add Datadog APM
const tracer = require('dd-trace').init();
```

**New Relic**:
```javascript
// Future: Add New Relic agent
require('newrelic');
```

---

## Troubleshooting

### Health Check Returns Degraded

**Symptoms**:
```json
{
  "status": "degraded",
  "checks": {
    "memory": {
      "percentage": 93
    }
  }
}
```

**Solutions**:
1. Check for memory leaks (heap snapshots)
2. Increase memory limits
3. Enable garbage collection
4. Scale horizontally

### Readiness Probe Failing

**Symptoms**:
- Pods removed from load balancer
- Traffic not reaching application

**Solutions**:
1. Check database connectivity
2. Verify initialization complete
3. Check for circular dependencies
4. Review startup logs

### Graceful Shutdown Timing Out

**Symptoms**:
```
Forced shutdown after timeout
```

**Solutions**:
1. Reduce `terminationGracePeriodSeconds`
2. Optimize database cleanup
3. Close long-running requests faster
4. Add connection draining

---

## Implementation Files

- **Health Checks**: `server/health.ts`
- **Route Registration**: `server/routes.ts` (lines 94-104)
- **Graceful Shutdown**: `server/index.ts` (lines 85-130)

---

## Security Considerations

### HIPAA Compliance

1. **Health Check Data Exposure**
   - ✅ No PHI in health check responses
   - ✅ No user data in diagnostic information
   - ✅ Environment-appropriate error messages

2. **Audit Trail**
   - Health check access not logged (high volume)
   - Shutdown events logged to audit trail
   - Error events logged with timestamp

3. **Access Control**
   - Health checks public (required for load balancers)
   - Consider IP whitelisting for `/health` in production
   - Use service mesh for internal-only health checks

---

## Next Steps

See **Production Hardening Roadmap** for remaining tasks:
- Task #8: Structured logging with Winston
- Task #9: Metrics collection endpoints
- Task #10: Error tracking and alerting
- Task #11: E2E testing suite
- Task #12: Job queue and caching (Redis)
- Task #13: Full PHI encryption integration
