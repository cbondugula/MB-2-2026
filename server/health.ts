import type { Request, Response } from "express";
import { db } from "./db";
import { sql } from "drizzle-orm";

interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  uptime: number;
  checks: {
    database: {
      status: "connected" | "disconnected" | "error";
      responseTime?: number;
      error?: string;
    };
    encryption: {
      enabled: boolean;
      keySet: boolean;
      keyValid: boolean;
      testPassed: boolean;
      algorithm: string;
      keyLength: number;
      environment: string;
    };
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
  };
  environment: string;
}

interface ReadinessStatus {
  ready: boolean;
  timestamp: string;
  checks: {
    database: boolean;
    server: boolean;
  };
}

interface LivenessStatus {
  alive: boolean;
  timestamp: string;
  uptime: number;
}

let isShuttingDown = false;
const startTime = Date.now();

/**
 * Set shutdown state for graceful shutdown
 */
export function setShuttingDown(state: boolean) {
  isShuttingDown = state;
}

/**
 * Check if application is shutting down
 */
export function getShuttingDown(): boolean {
  return isShuttingDown;
}

/**
 * Test database connectivity
 */
async function checkDatabase(): Promise<{
  status: "connected" | "disconnected" | "error";
  responseTime?: number;
  error?: string;
}> {
  const start = Date.now();
  try {
    await db.execute(sql`SELECT 1`);
    const responseTime = Date.now() - start;
    return {
      status: "connected",
      responseTime,
    };
  } catch (error) {
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get memory usage statistics
 */
function getMemoryStats() {
  const usage = process.memoryUsage();
  const total = usage.heapTotal;
  const used = usage.heapUsed;
  const percentage = Math.round((used / total) * 100);
  
  return {
    used: Math.round(used / 1024 / 1024), // MB
    total: Math.round(total / 1024 / 1024), // MB
    percentage,
  };
}

/**
 * Health check endpoint - comprehensive system health
 * Returns detailed status of all subsystems
 */
export async function healthCheck(req: Request, res: Response) {
  if (isShuttingDown) {
    return res.status(503).json({
      status: "unhealthy",
      message: "Server is shutting down",
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const { getEncryptionStatus } = await import("./encryption");
    const encryptionStatus = getEncryptionStatus();
    const dbCheck = await checkDatabase();
    const memoryStats = getMemoryStats();
    
    // Determine overall health status
    let status: "healthy" | "degraded" | "unhealthy" = "healthy";
    if (dbCheck.status === "error") {
      status = "unhealthy";
    } else if (dbCheck.status === "disconnected" || memoryStats.percentage > 90) {
      status = "degraded";
    }
    
    const health: HealthStatus = {
      status,
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - startTime) / 1000), // seconds
      checks: {
        database: dbCheck,
        encryption: encryptionStatus,
        memory: memoryStats,
      },
      environment: process.env.NODE_ENV || "development",
    };
    
    const statusCode = status === "healthy" ? 200 : status === "degraded" ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Health check failed",
    });
  }
}

/**
 * Readiness probe - is the application ready to serve traffic?
 * Used by load balancers to determine if instance should receive traffic
 */
export async function readinessCheck(req: Request, res: Response) {
  if (isShuttingDown) {
    return res.status(503).json({
      ready: false,
      reason: "Server is shutting down",
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const dbCheck = await checkDatabase();
    const databaseReady = dbCheck.status === "connected";
    const serverReady = !isShuttingDown;
    
    const ready = databaseReady && serverReady;
    
    const readiness: ReadinessStatus = {
      ready,
      timestamp: new Date().toISOString(),
      checks: {
        database: databaseReady,
        server: serverReady,
      },
    };
    
    res.status(ready ? 200 : 503).json(readiness);
  } catch (error) {
    res.status(503).json({
      ready: false,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Readiness check failed",
    });
  }
}

/**
 * Liveness probe - is the application process alive?
 * Used by orchestrators to determine if instance should be restarted
 */
export function livenessCheck(req: Request, res: Response) {
  const liveness: LivenessStatus = {
    alive: true,
    timestamp: new Date().toISOString(),
    uptime: Math.floor((Date.now() - startTime) / 1000), // seconds
  };
  
  res.status(200).json(liveness);
}
