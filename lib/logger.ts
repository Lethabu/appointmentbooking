// ============================================================================
// MONITORING SETUP #8: Custom Logging System
// File: lib/logger.ts
// Spec: Structured logging with correlation IDs
// ============================================================================

import { v4 as uuidv4 } from 'uuid';
import * as Sentry from '@sentry/nextjs';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

interface LogContext {
  tenantId?: string;
  userId?: string;
  requestId?: string;
  sessionId?: string;
  [key: string]: any;
}

interface LogEntry {
  timestamp: string;
  level: string;
  correlationId: string;
  message: string;
  context?: LogContext;
  data?: any;
}

class Logger {
  private context: LogContext;
  private correlationId: string;

  constructor(context: LogContext = {}) {
    this.context = context;
    this.correlationId = context.requestId || uuidv4();
  }

  private formatMessage(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      correlationId: this.correlationId,
      message,
      context: this.context,
      ...(data && { data }),
    };
  }

  private log(level: LogLevel, message: string, data?: any) {
    const logEntry = this.formatMessage(level, message, data);

    // Console output (structured in production, pretty in dev)
    if (process.env.NODE_ENV === 'production') {
      console.log(JSON.stringify(logEntry));
    } else {
      const color = {
        debug: '\x1b[36m', // Cyan
        info: '\x1b[32m',  // Green
        warn: '\x1b[33m',  // Yellow
        error: '\x1b[31m', // Red
        fatal: '\x1b[35m', // Magenta
      }[level];
      console.log(`${color}[${level.toUpperCase()}]\x1b[0m ${message}`, data || '');
    }

    // Send errors and fatals to Sentry
    if (level === LogLevel.ERROR || level === LogLevel.FATAL) {
      Sentry.captureMessage(message, {
        level: level === LogLevel.FATAL ? 'fatal' : 'error',
        extra: { ...this.context, data },
        tags: {
          correlationId: this.correlationId,
          ...(this.context.tenantId && { tenantId: this.context.tenantId }),
        },
      });
    }

    // Send to external logging service (e.g., Logtail, Datadog)
    if (process.env.LOGTAIL_TOKEN || process.env.DATADOG_API_KEY) {
      this.sendToExternalService(logEntry);
    }
  }

  private async sendToExternalService(logEntry: LogEntry) {
    try {
      if (process.env.LOGTAIL_TOKEN) {
        await fetch('https://in.logtail.com/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.LOGTAIL_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(logEntry),
        });
      }

      if (process.env.DATADOG_API_KEY) {
        await fetch(`https://http-intake.logs.datadoghq.com/v1/input/${process.env.DATADOG_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(logEntry),
        });
      }
    } catch (error) {
      // Fail silently to avoid logging loops
      console.error('Failed to send log to external service:', error);
    }
  }

  debug(message: string, data?: any) {
    this.log(LogLevel.DEBUG, message, data);
  }

  info(message: string, data?: any) {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message: string, data?: any) {
    this.log(LogLevel.WARN, message, data);
  }

  error(message: string, error?: Error | any, data?: any) {
    this.log(LogLevel.ERROR, message, {
      error: error?.message || error,
      stack: error?.stack,
      ...data,
    });
  }

  fatal(message: string, error?: Error | any, data?: any) {
    this.log(LogLevel.FATAL, message, {
      error: error?.message || error,
      stack: error?.stack,
      ...data,
    });
  }

  // Create child logger with additional context
  child(additionalContext: LogContext): Logger {
    return new Logger({ ...this.context, ...additionalContext });
  }

  // Business event logging methods
  business(message: string, event: string, data?: any) {
    this.info(`[BUSINESS] ${message}`, {
      event,
      businessData: data,
    });
  }

  security(message: string, threat: string, data?: any) {
    this.warn(`[SECURITY] ${message}`, {
      threat,
      securityData: data,
    });
  }

  performance(message: string, metric: string, value: number, unit: string) {
    this.info(`[PERFORMANCE] ${message}`, {
      metric,
      value,
      unit,
    });
  }
}

// Export factory function
export function createLogger(context?: LogContext): Logger {
  return new Logger(context);
}

// Export middleware to add request context to logs
export function withLogging(handler: any, operation: string) {
  return async (request: any, ...args: any[]) => {
    const requestId = request.headers?.get?.('x-request-id') || uuidv4();
    const logger = createLogger({
      requestId,
      operation,
      userAgent: request.headers?.get?.('user-agent'),
      ip: request.ip,
    });

    logger.info(`Starting ${operation}`);

    try {
      const result = await handler(request, ...args);
      logger.info(`Completed ${operation}`);
      return result;
    } catch (error) {
      logger.error(`Failed ${operation}`, error);
      throw error;
    }
  };
}

// Export singleton for simple cases
export const logger = new Logger();
