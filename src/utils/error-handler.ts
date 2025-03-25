import { Logger } from './logger';

/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
  constructor(message: string, public readonly code: string = 'GENERIC_ERROR') {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Global error handler
 */
export function handleError(error: Error | AppError): void {
  if (error instanceof AppError) {
    Logger.error(`${error.code}: ${error.message}`);
  } else {
    Logger.error(`Unexpected error: ${error.message}`, error);
  }
  
  // Exit with error code for critical errors
  if (error.message.includes('CRITICAL')) {
    process.exit(1);
  }
}