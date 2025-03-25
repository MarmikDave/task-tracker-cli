import { TaskService } from '../services/task.service';
import { TaskStatus } from '../models/task.models';
import { Logger } from '../utils/logger';
import { printUsage } from './usage';
import { AppError } from '../utils/error-handler';

/**
 * CLI command handler
 */
export class CommandHandler {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  /**
   * Execute a command with arguments
   */
  executeCommand(args: string[]): void {
    if (args.length === 0 || args[0] === 'help') {
      printUsage();
      return;
    }

    const command = args[0];

    try {
      switch (command) {
        case 'add':
          this.handleAddCommand(args);
          break;

        case 'update':
          this.handleUpdateCommand(args);
          break;

        case 'delete':
          this.handleDeleteCommand(args);
          break;

        case 'start':
          this.handleStartCommand(args);
          break;

        case 'complete':
          this.handleCompleteCommand(args);
          break;

        case 'list':
          this.handleListCommand(args);
          break;

        default:
          throw new AppError(`Unknown command: ${command}`, 'UNKNOWN_COMMAND');
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError(`Failed to execute command: ${command}`, 'COMMAND_EXECUTION_ERROR');
      }
    }
  }

  /**
   * Handle 'add' command
   */
  private handleAddCommand(args: string[]): void {
    if (args.length < 2) {
      throw new AppError('Missing task description', 'MISSING_PARAMETER');
    }
    this.taskService.addTask(args[1]);
  }

  /**
   * Handle 'update' command
   */
  private handleUpdateCommand(args: string[]): void {
    if (args.length < 3) {
      throw new AppError('Missing task ID or description', 'MISSING_PARAMETER');
    }
    
    const id = this.parseTaskId(args[1]);
    this.taskService.updateTask(id, args[2]);
  }

  /**
   * Handle 'delete' command
   */
  private handleDeleteCommand(args: string[]): void {
    if (args.length < 2) {
      throw new AppError('Missing task ID', 'MISSING_PARAMETER');
    }
    
    const id = this.parseTaskId(args[1]);
    this.taskService.deleteTask(id);
  }

  /**
   * Handle 'start' command
   */
  private handleStartCommand(args: string[]): void {
    if (args.length < 2) {
      throw new AppError('Missing task ID', 'MISSING_PARAMETER');
    }
    
    const id = this.parseTaskId(args[1]);
    this.taskService.updateTaskStatus(id, TaskStatus.IN_PROGRESS);
  }

  /**
   * Handle 'complete' command
   */
  private handleCompleteCommand(args: string[]): void {
    if (args.length < 2) {
      throw new AppError('Missing task ID', 'MISSING_PARAMETER');
    }
    
    const id = this.parseTaskId(args[1]);
    this.taskService.updateTaskStatus(id, TaskStatus.DONE);
  }

  /**
   * Handle 'list' command
   */
  private handleListCommand(args: string[]): void {
    let filter: TaskStatus | undefined = undefined;
    
    if (args.length > 1) {
      if (!this.isValidTaskStatus(args[1])) {
        throw new AppError(`Invalid status filter: ${args[1]}. Use: todo, in-progress, or done`, 'INVALID_PARAMETER');
      }
      filter = args[1] as TaskStatus;
    }

    const tasks = this.taskService.getTasks(filter);
    this.displayTasks(tasks);
  }

  /**
   * Display tasks in a formatted table
   */
  private displayTasks(tasks: any[]): void {
    if (tasks.length === 0) {
      Logger.info('No tasks found');
      return;
    }

    // Format the date fields for better readability
    const formattedTasks = tasks.map(task => ({
      ID: task.id,
      Status: task.status,
      Description: task.description,
      Created: new Date(task.createdAt).toLocaleString(),
      Updated: new Date(task.updatedAt).toLocaleString(),
    }));

    Logger.table(formattedTasks);
  }

  /**
   * Parse task ID from string
   */
  private parseTaskId(idStr: string): number {
    const id = parseInt(idStr);
    if (isNaN(id)) {
      throw new AppError(`Invalid task ID: ${idStr}`, 'INVALID_PARAMETER');
    }
    return id;
  }

  /**
   * Check if string is valid task status
   */
  private isValidTaskStatus(status: string): boolean {
    return Object.values(TaskStatus).includes(status as TaskStatus);
  }
}