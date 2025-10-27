import { db } from "./db";
import { auditLogs, type InsertAuditLog } from "@shared/schema";
import type { Request } from "express";

/**
 * HIPAA Audit Logger Service
 * 
 * Provides comprehensive audit logging for all database operations to ensure
 * HIPAA compliance by tracking who accessed what data, when, and how.
 */

export type AuditAction = "CREATE" | "READ" | "UPDATE" | "DELETE";

interface AuditLogParams {
  userId: string;
  action: AuditAction;
  tableName: string;
  recordId?: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
}

/**
 * Log a database operation for HIPAA compliance
 */
export async function logAudit(params: AuditLogParams): Promise<void> {
  try {
    const auditEntry: InsertAuditLog = {
      userId: params.userId,
      action: params.action,
      tableName: params.tableName,
      recordId: params.recordId,
      oldValues: params.oldValues,
      newValues: params.newValues,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      metadata: params.metadata,
    };

    await db.insert(auditLogs).values(auditEntry);
  } catch (error) {
    // Log the error but don't fail the main operation
    console.error("Failed to create audit log:", error);
  }
}

/**
 * Extract audit context from Express request
 */
export function getAuditContext(req: Request): Pick<AuditLogParams, "ipAddress" | "userAgent"> {
  return {
    ipAddress: req.ip || req.connection.remoteAddress || "unknown",
    userAgent: req.get("user-agent") || "unknown",
  };
}

/**
 * Create an audit logger for a specific user from request
 */
export function createAuditLogger(req: Request, userId: string) {
  const context = getAuditContext(req);

  return {
    logCreate: (tableName: string, recordId: string, newValues: any, metadata?: any) =>
      logAudit({
        userId,
        action: "CREATE",
        tableName,
        recordId,
        newValues,
        metadata,
        ...context,
      }),

    logRead: (tableName: string, recordId?: string, metadata?: any) =>
      logAudit({
        userId,
        action: "READ",
        tableName,
        recordId,
        metadata,
        ...context,
      }),

    logUpdate: (tableName: string, recordId: string, oldValues: any, newValues: any, metadata?: any) =>
      logAudit({
        userId,
        action: "UPDATE",
        tableName,
        recordId,
        oldValues,
        newValues,
        metadata,
        ...context,
      }),

    logDelete: (tableName: string, recordId: string, oldValues: any, metadata?: any) =>
      logAudit({
        userId,
        action: "DELETE",
        tableName,
        recordId,
        oldValues,
        metadata,
        ...context,
      }),
  };
}

/**
 * Query audit logs for compliance reporting
 * Uses database WHERE clauses to avoid loading entire table into memory
 */
export async function getAuditLogs(filters: {
  userId?: string;
  tableName?: string;
  action?: AuditAction;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}) {
  const { eq, gte, lte, and } = await import("drizzle-orm");
  
  // Build WHERE conditions based on filters
  const conditions = [];
  
  if (filters.userId) {
    conditions.push(eq(auditLogs.userId, filters.userId));
  }
  if (filters.tableName) {
    conditions.push(eq(auditLogs.tableName, filters.tableName));
  }
  if (filters.action) {
    conditions.push(eq(auditLogs.action, filters.action));
  }
  if (filters.startDate) {
    conditions.push(gte(auditLogs.timestamp, filters.startDate));
  }
  if (filters.endDate) {
    conditions.push(lte(auditLogs.timestamp, filters.endDate));
  }
  
  // Build query with WHERE and LIMIT
  let baseQuery = db
    .select()
    .from(auditLogs);
  
  // Apply WHERE conditions if any
  if (conditions.length > 0) {
    baseQuery = baseQuery.where(and(...conditions)) as any;
  }
  
  // Apply ordering and limit
  let finalQuery = baseQuery.orderBy(auditLogs.timestamp) as any;
  
  if (filters.limit) {
    finalQuery = finalQuery.limit(filters.limit);
  }
  
  return await finalQuery;
}
