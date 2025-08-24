/**
 * Common Error Handler for Platform Services
 * Eliminates duplicate try-catch patterns across the platform
 */

export interface ServiceResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp?: string;
}

export interface ServiceError {
  operation: string;
  error: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
}

export class CommonErrorHandler {
  private static errorLog: ServiceError[] = [];

  /**
   * Wraps async operations with consistent error handling
   */
  static async handleServiceOperation<T>(
    operation: string,
    serviceCall: () => Promise<T>,
    fallbackData?: T
  ): Promise<ServiceResult<T>> {
    try {
      const data = await serviceCall();
      return {
        success: true,
        data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      this.logError({
        operation,
        error: errorMessage,
        severity: 'medium',
        timestamp: new Date().toISOString()
      });

      return {
        success: false,
        error: `${operation} failed: ${errorMessage}`,
        data: fallbackData,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Handles analysis operations with specific error patterns
   */
  static async handleAnalysisOperation<T>(
    analysisType: string,
    analysisCall: () => Promise<T>,
    fallbackAnalysis?: T
  ): Promise<ServiceResult<T>> {
    return this.handleServiceOperation(
      `${analysisType} analysis`,
      analysisCall,
      fallbackAnalysis
    );
  }

  /**
   * Handles optimization operations
   */
  static async handleOptimizationOperation<T>(
    optimizationType: string,
    optimizationCall: () => Promise<T>,
    fallbackOptimization?: T
  ): Promise<ServiceResult<T>> {
    return this.handleServiceOperation(
      `${optimizationType} optimization`,
      optimizationCall,
      fallbackOptimization
    );
  }

  /**
   * Handles test operations
   */
  static async handleTestOperation<T>(
    testType: string,
    testCall: () => Promise<T>,
    fallbackResult?: T
  ): Promise<ServiceResult<T>> {
    return this.handleServiceOperation(
      `${testType} test`,
      testCall,
      fallbackResult
    );
  }

  /**
   * Standard error response for API endpoints
   */
  static createErrorResponse(operation: string, error: string, statusCode: number = 500) {
    this.logError({
      operation,
      error,
      severity: statusCode >= 500 ? 'high' : 'medium',
      timestamp: new Date().toISOString()
    });

    return {
      success: false,
      error: `${operation} failed`,
      details: error,
      timestamp: new Date().toISOString(),
      statusCode
    };
  }

  /**
   * Get recent errors for monitoring
   */
  static getRecentErrors(limit: number = 50): ServiceError[] {
    return this.errorLog
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  /**
   * Get error statistics
   */
  static getErrorStats() {
    const recentErrors = this.errorLog.filter(
      error => Date.now() - new Date(error.timestamp).getTime() < 3600000 // Last hour
    );

    return {
      totalErrors: this.errorLog.length,
      recentErrors: recentErrors.length,
      errorsByOperation: this.groupErrorsByOperation(recentErrors),
      errorsBySeverity: this.groupErrorsBySeverity(recentErrors)
    };
  }

  /**
   * Clear old errors (keep last 1000)
   */
  static cleanupErrorLog() {
    if (this.errorLog.length > 1000) {
      this.errorLog = this.errorLog
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 1000);
    }
  }

  private static logError(error: ServiceError) {
    this.errorLog.push(error);
    console.error(`[${error.severity.toUpperCase()}] ${error.operation}: ${error.error}`);
    
    // Auto-cleanup
    if (this.errorLog.length > 1200) {
      this.cleanupErrorLog();
    }
  }

  private static groupErrorsByOperation(errors: ServiceError[]) {
    return errors.reduce((acc, error) => {
      acc[error.operation] = (acc[error.operation] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private static groupErrorsBySeverity(errors: ServiceError[]) {
    return errors.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
}

export const errorHandler = CommonErrorHandler;