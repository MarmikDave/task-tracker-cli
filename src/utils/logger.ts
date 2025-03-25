import chalk from 'chalk';
import { config } from '../config/config';

/**
 * Simple logger utility with color support
 */
export class Logger {
  /**
   * Log an info message
   */
  static info(message: string): void {
    console.log(chalk.blue(`[INFO] ${message}`));
  }

  /**
   * Log a success message
   */
  static success(message: string): void {
    console.log(chalk.green(`[SUCCESS] ${message}`));
  }

  /**
   * Log a warning message
   */
  static warn(message: string): void {
    console.log(chalk.yellow(`[WARNING] ${message}`));
  }

  /**
   * Log an error message
   */
  static error(message: string, error?: Error): void {
    console.error(chalk.red(`[ERROR] ${message}`));
    
    if (error && config.debug) {
      console.error(chalk.red(error.stack || error.message));
    }
  }

  /**
   * Log a debug message (only in debug mode)
   */
  static debug(message: string): void {
    if (config.debug) {
      console.log(chalk.gray(`[DEBUG] ${message}`));
    }
  }

  /**
   * Log a table of data
   */
  static table(data: any[]): void {
    console.table(data);
  }
}