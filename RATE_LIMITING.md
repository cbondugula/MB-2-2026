# Rate Limiting Configuration

## Overview

MedBuilder implements comprehensive API rate limiting to prevent abuse, DDoS attacks, and ensure fair resource allocation across users. The rate limiting system uses `express-rate-limit` with IPv6-safe key generation.

## Current Implementation

### Active Rate Limiters

All rate limiters are enforced as of Task #6:

| Endpoint Type | Limit | Window | Description |
|--------------|-------|--------|-------------|
| **Global** | 1,000 requests | 15 minutes | Applied to all routes |
| **API Reads** (GET) | 100 requests | 1 minute | All GET/HEAD/OPTIONS requests |
| **API Writes** (POST/PUT/PATCH/DELETE) | 30 requests | 1 minute | All state-changing operations |
| **Auth Endpoints** | 5 attempts | 15 minutes | Login, registration (brute force protection) |
| **AI Generation** | 10 requests | 1 minute | Chat-to-code, AI completion (resource protection) |
| **Chat Messages** | 30 messages | 1 minute | Chat conversation endpoints |
| **File Uploads** | 10 uploads | 1 minute | File/attachment uploads |
| **Webhooks** | 60 requests | 1 minute | Webhook callbacks |

### Key Generation Strategy

Rate limits are enforced per:

1. **Authenticated users**: Uses user ID (`sub` from Replit Auth) - most accurate
2. **Unauthenticated users**: Uses IP address with IPv6-safe `ipKeyGenerator`
   - IPv4 addresses: Used as-is (e.g., `192.168.1.1`)
   - IPv6 addresses: Grouped into `/64` CIDR blocks to prevent address rotation bypass

### Implementation Files

- `server/rate-limiter.ts` - Rate limiter definitions
- `server/routes.ts` - Global and method-specific middleware
- `server/routes/chat-to-code.ts` - Chat and AI generation rate limiting

## Current Implementation Status

✅ **COMPLETED (Task #6)**:
- Global rate limiting active across all routes
- Method-specific rate limiting (GET vs POST/PUT/PATCH/DELETE)
- Auth endpoint protection (5 attempts / 15 minutes)
- AI generation rate limiting (10 requests / minute)
- Chat message rate limiting (30 messages / minute)
- IPv6-safe key generation to prevent address rotation bypass
- Comprehensive monitoring and audit logging integration

⏳ **FUTURE REQUIREMENT (Separate Task)**:
- Redis-backed storage for production multi-instance deployment

## Production Requirements

### ⚠️ FUTURE: Redis-Backed Storage Required

**Current State**: Using in-memory storage (acceptable for single-instance development/staging)

**Production Issue**: In-memory storage has limitations for multi-instance deployments:
- No shared counters across multiple server instances
- Rate limits reset on server restart
- No persistence of rate limit state
- Not HIPAA-compliant for audit trails

**Solution**: Implement Redis-backed storage for distributed rate limiting.

### Redis Integration Steps

1. **Install Redis adapter**:
   ```bash
   npm install rate-limit-redis redis
   ```

2. **Create Redis store** (`server/rate-limit-store.ts`):
   ```typescript
   import RedisStore from 'rate-limit-redis';
   import { createClient } from 'redis';

   const redisClient = createClient({
     url: process.env.REDIS_URL || 'redis://localhost:6379'
   });

   await redisClient.connect();

   export const redisStore = new RedisStore({
     client: redisClient,
     prefix: 'rl:', // Rate limit prefix
     sendCommand: (...args: string[]) => redisClient.sendCommand(args),
   });
   ```

3. **Update rate limiters**:
   ```typescript
   import { redisStore } from './rate-limit-store';

   export const globalRateLimiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 1000,
     store: redisStore,  // Add this line
     // ... rest of config
   });
   ```

4. **Environment variables**:
   ```bash
   REDIS_URL=redis://your-redis-host:6379
   REDIS_TLS=true  # For production
   REDIS_PASSWORD=your-redis-password
   ```

### Redis Hosting Options

**For Replit Deployment**:
- Use Replit's built-in Redis (if available)
- Upstash Redis (serverless, HIPAA-compliant)
- AWS ElastiCache (enterprise)
- Redis Cloud (managed)

## Rate Limit Tuning Recommendations

### Current Limits Analysis

| Issue | Current | Recommended | Reason |
|-------|---------|-------------|--------|
| **Global limit too tight** | 1000/15min (~1.1 RPS) | 5000/15min (~5.6 RPS) | Enterprise integrations need burst capacity |
| **Write limits constraining** | 30/min | 100/min | EHR sync operations require higher throughput |
| **Read limits acceptable** | 100/min | 100-200/min | Adequate for most use cases |
| **AI generation appropriate** | 10/min | 10-20/min | Balances cost vs usability |
| **Auth limit correct** | 5/15min | 5-10/15min | Good brute force protection |

### Suggested Production Limits

```typescript
// Recommended production configuration
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // Increased from 1000
  message: {
    error: "Global rate limit exceeded. Contact support for enterprise limits.",
    limit: "5000 requests per 15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  store: redisStore  // Must use Redis in production
});

export const apiWriteRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100, // Increased from 30 for EHR integrations
  message: {
    error: "Write operation limit exceeded.",
    limit: "100 write requests per minute"
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  store: redisStore
});
```

### Separate Internal vs External Traffic

For production, consider separating internal service-to-service traffic from end-user traffic:

```typescript
const keyGenerator = (req: Request): string => {
  // Bypass rate limiting for internal services
  const internalServiceToken = req.headers['x-internal-service-token'];
  if (internalServiceToken === process.env.INTERNAL_SERVICE_TOKEN) {
    return `internal:${nanoid()}`; // Each request gets unique key (no limiting)
  }

  // Use user ID for authenticated users
  const user = req.user as any;
  if (user?.sub || user?.id) {
    return `user:${user.sub || user.id}`;
  }
  
  // Use IPv6-safe IP for unauthenticated users
  return ipKeyGenerator(req.ip || req.socket.remoteAddress || 'unknown');
};
```

## Premium User Tiers

Future implementation for differentiated rate limits:

```typescript
export const aiGenerationRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: async (req) => {
    const user = req.user as any;
    if (!user) return 10; // Default for unauthenticated

    // Query user's plan from database
    const userPlan = await storage.getUserPlan(user.sub);
    
    switch (userPlan) {
      case 'enterprise': return 100; // 100 AI requests/min
      case 'pro': return 50;          // 50 AI requests/min
      case 'free': return 10;         // 10 AI requests/min
      default: return 10;
    }
  },
  keyGenerator,
  store: redisStore
});
```

## Monitoring & Alerting

### Key Metrics to Track

1. **Rate limit violations per endpoint**
2. **Top users hitting limits**
3. **Failed vs successful requests ratio**
4. **Average response times under load**

### Recommended Monitoring Setup

```typescript
// Add to rate limiter handler
handler: (req, res) => {
  // Log to monitoring service (e.g., DataDog, New Relic)
  logger.warn('Rate limit exceeded', {
    ip: req.ip,
    userId: req.user?.sub,
    path: req.path,
    method: req.method,
    limit: res.getHeader('X-RateLimit-Limit'),
    remaining: res.getHeader('X-RateLimit-Remaining'),
  });

  res.status(429).json({
    error: "Too many requests",
    retryAfter: res.getHeader('Retry-After'),
  });
}
```

## HIPAA Compliance Notes

Rate limiting contributes to HIPAA compliance by:

1. **Preventing brute force attacks** on PHI access
2. **Logging rate limit violations** for security audits
3. **Protecting against DDoS** that could cause PHI unavailability
4. **Ensuring service availability** for critical healthcare operations

### Audit Log Integration

All rate limit violations should be logged to the audit system:

```typescript
handler: async (req, res) => {
  const auditLogger = createAuditLogger(req, req.user?.sub || 'unauthenticated');
  await auditLogger.logSecurityEvent('rate_limit_exceeded', {
    path: req.path,
    method: req.method,
    ip: req.ip,
    limit: res.getHeader('X-RateLimit-Limit'),
  });

  res.status(429).json({ error: "Rate limit exceeded" });
}
```

## Testing Rate Limits

### Manual Testing

```bash
# Test global rate limit (1000 requests in 15 minutes)
for i in {1..1010}; do
  curl -i http://localhost:5000/health
done

# Test write rate limit (30 requests per minute)
for i in {1..35}; do
  curl -X POST http://localhost:5000/api/projects \
    -H "Content-Type: application/json" \
    -d '{"name":"Test"}'
done
```

### Automated Testing

Use `run_test` tool with Playwright to verify:

1. Rate limit headers are present (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`)
2. 429 status codes returned when limits exceeded
3. Different limits for authenticated vs unauthenticated users
4. IPv6 addresses properly grouped into /64 blocks

## Health Check Exemptions

The following endpoints are exempt from rate limiting:

- `/health`
- `/api/health`
- `/ping`
- `/_health`

This ensures monitoring systems can always check application health.

## Retry-After Header

All rate limiters include the `Retry-After` header in 429 responses, telling clients how long to wait before retrying (in seconds).

Example response:
```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1234567890
Retry-After: 900

{
  "error": "Too many requests from this user/IP, please try again later.",
  "retryAfter": "Check the Retry-After header for wait time"
}
```

---

**Last Updated**: 2025-10-27  
**Next Review**: Before production deployment  
**Priority**: HIGH - Redis integration required for production
