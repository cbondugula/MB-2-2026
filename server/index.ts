import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log as viteLog } from "./vite";
import { seedDatabase } from "./seed-data";
import { log, logStartup, logShutdown, logError } from "./logger";
import { requestContextMiddleware, httpLoggingMiddleware, errorLoggingMiddleware } from "./middleware/request-logger";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
      
      log('Server closed, cleaning up resources...');
      
      // Give ongoing requests time to complete
      setTimeout(() => {
        log('Graceful shutdown complete');
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
