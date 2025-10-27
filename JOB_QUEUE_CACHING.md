# Job Queue & Caching Infrastructure

## Overview
Documentation for implementing job queue and caching infrastructure for MedBuilder platform using BullMQ and Redis.

## Why We Need This

### Current Limitations
1. **No Background Processing:** Long-running tasks block HTTP requests
2. **No Caching:** Database queries repeated unnecessarily
3. **No Task Retry:** Failed operations require manual intervention
4. **No Rate Limiting Persistence:** Rate limits reset on server restart
5. **No Distributed State:** Cannot scale horizontally

### Use Cases

**Job Queue (BullMQ):**
- AI code generation (30-60 second operations)
- Large file processing
- Report generation
- Email sending
- Database migrations
- Scheduled tasks (cron jobs)

**Caching (Redis):**
- API response caching
- Session storage
- Rate limiting state
- Temporary data storage
- Real-time features (pub/sub)

## Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ HTTP Request
       ▼
┌─────────────────┐
│  Express App    │◄─────┐
└─────────┬───────┘      │
          │              │
          ├──────────────┼─────────┐
          │              │         │
          ▼              ▼         ▼
    ┌─────────┐    ┌─────────┐ ┌─────────┐
    │PostgreSQL│    │  Redis  │ │  Redis  │
    │  (Data)  │    │ (Cache) │ │ (Queue) │
    └──────────┘    └─────────┘ └────┬────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │ Bull Workers │
                              └──────────────┘
```

## Redis Setup

### Installation

**Development (Docker):**
```bash
docker run -d \
  --name medbuilder-redis \
  -p 6379:6379 \
  -v redis-data:/data \
  redis:7-alpine \
  redis-server --appendonly yes
```

**Production (Managed Service):**
- **Replit:** Use Replit Redis (when available)
- **AWS:** ElastiCache for Redis
- **Azure:** Azure Cache for Redis
- **GCP:** Cloud Memorystore
- **Heroku:** Heroku Redis
- **Upstash:** Serverless Redis

### Configuration

```typescript
// server/redis.ts
import Redis from 'ioredis';

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: 3,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
};

export const redis = new Redis(redisConfig);

// Test connection
redis.on('connect', () => {
  console.log('✅ Redis connected');
});

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});
```

### Environment Variables

```bash
# .env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_secure_password
REDIS_URL=redis://:password@host:port  # Alternative format
```

## BullMQ Job Queue

### Installation

```bash
npm install bullmq ioredis
```

### Queue Setup

```typescript
// server/queues/code-generation.queue.ts
import { Queue, Worker, Job } from 'bullmq';
import { redis } from '../redis';
import { chatToCodeService } from '../chat-to-code-service';

// Create queue
export const codeGenerationQueue = new Queue('code-generation', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: {
      age: 24 * 3600, // Keep completed jobs for 24 hours
      count: 1000,
    },
    removeOnFail: {
      age: 7 * 24 * 3600, // Keep failed jobs for 7 days
    },
  },
});

// Worker to process jobs
export const codeGenerationWorker = new Worker(
  'code-generation',
  async (job: Job) => {
    const { conversationId, message, userId } = job.data;
    
    // Update progress
    await job.updateProgress(10);
    
    try {
      // Generate code
      const result = await chatToCodeService.generateCode(
        conversationId,
        message,
        userId
      );
      
      await job.updateProgress(100);
      return result;
    } catch (error) {
      // Log error
      console.error('Code generation failed:', error);
      throw error; // Will trigger retry
    }
  },
  {
    connection: redis,
    concurrency: 5, // Process 5 jobs concurrently
  }
);

// Event listeners
codeGenerationWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

codeGenerationWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});
```

### Using the Queue

```typescript
// server/routes/chat-to-code.ts
import { codeGenerationQueue } from '../queues/code-generation.queue';

// Add job to queue instead of processing immediately
app.post('/api/chat/:conversationId/message', async (req, res) => {
  const { conversationId } = req.params;
  const { message } = req.body;
  const userId = req.user?.id;
  
  // Add job to queue
  const job = await codeGenerationQueue.add('generate', {
    conversationId,
    message,
    userId,
  });
  
  // Return job ID immediately
  res.json({
    jobId: job.id,
    status: 'queued',
    message: 'Code generation started',
  });
});

// Check job status
app.get('/api/jobs/:jobId', async (req, res) => {
  const { jobId } = req.params;
  const job = await codeGenerationQueue.getJob(jobId);
  
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  
  const state = await job.getState();
  const progress = job.progress;
  
  res.json({
    id: job.id,
    state,
    progress,
    result: await job.returnvalue,
    failedReason: job.failedReason,
  });
});
```

### Scheduled Jobs (Cron)

```typescript
// server/queues/cleanup.queue.ts
import { Queue } from 'bullmq';
import { redis } from '../redis';

export const cleanupQueue = new Queue('cleanup', {
  connection: redis,
});

// Add recurring job
await cleanupQueue.add(
  'daily-cleanup',
  { type: 'old-conversations' },
  {
    repeat: {
      pattern: '0 0 * * *', // Daily at midnight
    },
  }
);
```

## Caching Implementation

### Basic Caching

```typescript
// server/cache.ts
import { redis } from './redis';

export class CacheService {
  // Get cached value
  async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  }
  
  // Set cached value with TTL
  async set(key: string, value: any, ttlSeconds = 3600): Promise<void> {
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
  }
  
  // Delete cached value
  async delete(key: string): Promise<void> {
    await redis.del(key);
  }
  
  // Delete by pattern
  async deletePattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}

export const cache = new CacheService();
```

### Cache Middleware

```typescript
// server/middleware/cache.middleware.ts
import { cache } from '../cache';

export function cacheMiddleware(ttl = 60) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    const key = `cache:${req.url}`;
    
    // Check cache
    const cached = await cache.get(key);
    if (cached) {
      return res.json(cached);
    }
    
    // Cache response
    const originalJson = res.json;
    res.json = function(body) {
      cache.set(key, body, ttl);
      return originalJson.call(this, body);
    };
    
    next();
  };
}

// Usage
app.get('/api/projects', cacheMiddleware(300), async (req, res) => {
  const projects = await storage.getProjects();
  res.json(projects);
});
```

### Cache Invalidation

```typescript
// Invalidate cache when data changes
app.post('/api/projects', async (req, res) => {
  const project = await storage.createProject(req.body);
  
  // Invalidate project list cache
  await cache.deletePattern('cache:/api/projects*');
  
  res.json(project);
});
```

## Rate Limiting with Redis

### Distributed Rate Limiting

```typescript
// server/rate-limiter-redis.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from './redis';

export const redisRateLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:', // Rate limit prefix
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: req.rateLimit.resetTime,
    });
  },
});
```

This allows rate limiting to work across multiple server instances.

## Session Storage with Redis

```typescript
// server/index.ts
import session from 'express-session';
import RedisStore from 'connect-redis';
import { redis } from './redis';

app.use(session({
  store: new RedisStore({ client: redis }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));
```

## Real-Time Features (Pub/Sub)

```typescript
// server/realtime/pubsub.ts
import { redis } from '../redis';

export class PubSubService {
  private subscriber: Redis;
  private publisher: Redis;
  
  constructor() {
    this.subscriber = redis.duplicate();
    this.publisher = redis.duplicate();
  }
  
  // Publish message
  async publish(channel: string, message: any): Promise<void> {
    await this.publisher.publish(channel, JSON.stringify(message));
  }
  
  // Subscribe to channel
  subscribe(channel: string, handler: (message: any) => void): void {
    this.subscriber.subscribe(channel, (err) => {
      if (err) {
        console.error('Subscribe error:', err);
      }
    });
    
    this.subscriber.on('message', (ch, msg) => {
      if (ch === channel) {
        handler(JSON.parse(msg));
      }
    });
  }
}

// Usage: Real-time code generation updates
const pubsub = new PubSubService();

// In worker: Publish progress
await pubsub.publish(`code-gen:${jobId}`, {
  progress: 50,
  status: 'Generating components...',
});

// In API: Subscribe to updates
pubsub.subscribe(`code-gen:${jobId}`, (update) => {
  // Send to client via WebSocket
  socket.emit('generation-progress', update);
});
```

## Monitoring & Observability

### BullMQ Dashboard

Install Bull Board for visual monitoring:
```bash
npm install @bull-board/express @bull-board/api
```

```typescript
// server/index.ts
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [
    new BullMQAdapter(codeGenerationQueue),
    new BullMQAdapter(cleanupQueue),
  ],
  serverAdapter,
});

app.use('/admin/queues', serverAdapter.getRouter());
```

Access at: `http://localhost:5000/admin/queues`

### Redis Monitoring

```typescript
// server/health.ts
export async function getRedisHealth() {
  try {
    const ping = await redis.ping();
    const info = await redis.info('stats');
    const memory = await redis.info('memory');
    
    return {
      connected: ping === 'PONG',
      stats: parseRedisInfo(info),
      memory: parseRedisInfo(memory),
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message,
    };
  }
}
```

## Cost Estimation

### Development
- **Docker Redis:** Free
- **Local Development:** $0/month

### Production

**Upstash (Serverless):**
- Free tier: 10,000 commands/day
- Pay-as-you-go: $0.2 per 100,000 commands
- **Estimated:** $10-50/month

**AWS ElastiCache:**
- cache.t4g.micro: $12/month
- cache.t4g.small: $24/month
- **Estimated:** $25-100/month

**Heroku Redis:**
- Premium 0: $15/month
- Premium 1: $50/month
- **Estimated:** $15-50/month

## Migration Path

### Phase 1: Redis Setup
1. Add Redis to development environment
2. Configure connection
3. Add health checks
4. Test basic operations

### Phase 2: Caching
1. Implement CacheService
2. Add cache middleware
3. Cache expensive queries
4. Implement invalidation

### Phase 3: Rate Limiting
1. Migrate to Redis-backed rate limiting
2. Test across multiple instances
3. Monitor for issues

### Phase 4: Job Queue
1. Setup BullMQ
2. Migrate long-running tasks
3. Add monitoring
4. Implement scheduled jobs

### Phase 5: Sessions
1. Migrate session storage to Redis
2. Test session persistence
3. Verify across instances

## Best Practices

### 1. Key Naming Convention
```typescript
// Use hierarchical keys
const keys = {
  cache: (resource: string, id: string) => `cache:${resource}:${id}`,
  session: (sessionId: string) => `session:${sessionId}`,
  rateLimit: (ip: string) => `rl:${ip}`,
  queue: (name: string) => `bull:${name}`,
};
```

### 2. TTL Everything
```typescript
// Always set expiration
await redis.setex('key', 3600, 'value'); // Expires in 1 hour
```

### 3. Error Handling
```typescript
try {
  const value = await redis.get('key');
  return value ? JSON.parse(value) : null;
} catch (error) {
  // Log error but don't crash
  console.error('Redis error:', error);
  // Fall back to database
  return await database.query('...');
}
```

### 4. Connection Pooling
```typescript
// Use connection pooling for high traffic
const redis = new Redis({
  lazyConnect: true,
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
});
```

## Troubleshooting

**Redis connection fails:**
```bash
# Check Redis is running
docker ps | grep redis

# Check connection
redis-cli ping

# Check logs
docker logs medbuilder-redis
```

**Queue jobs not processing:**
```bash
# Check worker is running
# Check Redis connection
# Verify queue configuration
# Check for errors in logs
```

**Cache not working:**
```bash
# Verify Redis connection
# Check TTL settings
# Verify cache keys
# Test manually: redis-cli GET cache:key
```

## Related Documentation
- [RATE_LIMITING.md](./RATE_LIMITING.md) - Rate limiting implementation
- [MONITORING.md](./MONITORING.md) - Metrics and observability
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment
