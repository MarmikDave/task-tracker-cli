import * as fs from 'fs';
import * as path from 'path';
import { Task, Tasks, TaskStatus } from '../models/task.models';
import { Logger } from '../utils/logger';
import { AppError } from '../utils/error-handler';
import { config } from '../config/config';

/**
 * Service for managing tasks
 */
export class TaskService {
  private tasksFilePath: string;
  private tasks: Tasks;

  /**
   * Initialize the task service
   */
  constructor() {
    this.tasksFilePath = config.tasksFilePath;
    this.ensureDirectoryExists();
    this.tasks = this.loadTasks();
  }

  /**
   * Ensure the directory for the tasks file exists
   */
  private ensureDirectoryExists(): void {
    const directory = path.dirname(this.tasksFilePath);
    
    if (!fs.existsSync(directory)) {
      try {
        fs.mkdirSync(directory, { recursive: true });
        Logger.debug(`Created directory: ${directory}`);
      } catch (error) {
        throw new AppError(`Failed to create directory: ${directory}`, 'DIRECTORY_CREATE_ERROR');
      }
    }
  }

  /**
   * Load tasks from JSON file or initialize if file doesn't exist
   */
  private loadTasks(): Tasks {
    try {
      if (fs.existsSync(this.tasksFilePath)) {
        const data = fs.readFileSync(this.tasksFilePath, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      const typedError = error as Error;
      Logger.error(`Error reading tasks file: ${typedError.message}`, typedError);
    }
    
    // Return default tasks object if file doesn't exist or is invalid
    return { tasks: [], lastId: 0 };
  }

  /**
   * Save tasks to JSON file
   */
  private saveTasks(): void {
    try {
      fs.writeFileSync(this.tasksFilePath, JSON.stringify(this.tasks, null, 2));
      Logger.debug(`Tasks saved to ${this.tasksFilePath}`);
    } catch (error) {
      const typedError = error as Error;
      throw new AppError(`Failed to save tasks: ${typedError.message}`, 'SAVE_TASKS_ERROR');
    }
  }

  /**
   * Add a new task
   */
  addTask(description: string): Task {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: ++this.tasks.lastId,
      description,
      status: TaskStatus.TODO,
      createdAt: now,
      updatedAt: now
    };

    this.tasks.tasks.push(newTask);
    this.saveTasks();
    Logger.success(`Task added successfully (ID: ${newTask.id})`);
    return newTask;
  }

  /**
   * Update an existing task
   */
  updateTask(id: number, description: string): Task {
    const task = this.findTaskById(id);
    
    task.description = description;
    task.updatedAt = new Date().toISOString();
    this.saveTasks();
    Logger.success(`Task ${id} updated successfully`);
    return task;
  }

  /**
   * Delete a task
   */
  deleteTask(id: number): void {
    const taskIndex = this.tasks.tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) {
      throw new AppError(`Task with ID ${id} not found`, 'TASK_NOT_FOUND');
    }

    this.tasks.tasks.splice(taskIndex, 1);
    this.saveTasks();
    Logger.success(`Task ${id} deleted successfully`);
  }

  /**
   * Update task status
   */
  updateTaskStatus(id: number, status: TaskStatus): Task {
    const task = this.findTaskById(id);
    
    task.status = status;
    task.updatedAt = new Date().toISOString();
    this.saveTasks();
    Logger.success(`Task ${id} marked as ${status}`);
    return task;
  }

  /**
   * Get tasks based on status filter
   */
  getTasks(filter?: TaskStatus): Task[] {
    if (filter) {
      return this.tasks.tasks.filter(task => task.status === filter);
    }
    return [...this.tasks.tasks];
  }

  /**
   * Find a task by ID
   */
  private findTaskById(id: number): Task {
    const task = this.tasks.tasks.find(t => t.id === id);
    
    if (!task) {
      throw new AppError(`Task with ID ${id} not found`, 'TASK_NOT_FOUND');
    }
    
    return task;
  }
}