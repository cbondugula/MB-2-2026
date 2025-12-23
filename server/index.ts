import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log as viteLog } from "./vite";
import { seedDatabase } from "./seed-data";
import { log, logStartup, logShutdown, logError } from "./logger";
import { requestContextMiddleware, httpLoggingMiddleware, errorLoggingMiddleware } from "./middleware/request-logger";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();

// Security headers with Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://js.stripe.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://api.stripe.com", "wss:", "ws:"],
      frameSrc: ["'self'", "https://js.stripe.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// Global rate limiting - 1000 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { message: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// Stricter rate limit for auth endpoints - 10 attempts per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many login attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/login", authLimiter);
app.use("/api/demo-login", authLimiter);

// API rate limit - 100 requests per minute
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { message: "API rate limit exceeded" },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", apiLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Request logging middleware (before routes)
app.use(requestContextMiddleware);
app.use(httpLoggingMiddleware);

(async () => {
  // Seed the database with initial data
  try {
    await seedDatabase();
  } catch (error) {
    console.error('Database seeding failed:', error);
  }

  const server = await registerRoutes(app);

  // Error logging middleware (before error handler)
  app.use(errorLoggingMiddleware);
  
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    viteLog(`serving on port ${port}`);
    logStartup({
      port,
      environment: process.env.NODE_ENV || "development",
      nodeVersion: process.version,
      databaseConnected: true,
    });
  });

  // Graceful shutdown handling
  const { setShuttingDown } = await import("./health");
  
  async function gracefulShutdown(signal: string) {
    viteLog(`${signal} received, starting graceful shutdown...`);
    logShutdown(signal);
    setShuttingDown(true);
    
    // Stop accepting new connections
    server.close(async (err) => {
      if (err) {
        console.error('Error closing server:', err);
        process.exit(1);
      }
      
      log.info('Server closed, cleaning up resources...');
      
      // Give ongoing requests time to complete
      setTimeout(() => {
        log.info('Graceful shutdown complete');
        process.exit(0);
      }, 5000); // 5 second grace period
    });
    
    // Force shutdown after 30 seconds if graceful shutdown hasn't completed
    setTimeout(() => {
      console.error('Forced shutdown after timeout');
      process.exit(1);
    }, 30000);
  }
  
  // Handle SIGTERM (Docker, Kubernetes, production deployments)
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  
  // Handle SIGINT (Ctrl+C in development)
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  
  // Handle uncaught errors
  process.on('uncaughtException', (error) => {
    logError(error, { event: 'uncaughtException' });
    gracefulShutdown('UNCAUGHT_EXCEPTION');
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    logError(error, { event: 'unhandledRejection', promise: String(promise) });
    gracefulShutdown('UNHANDLED_REJECTION');
  });
})();
