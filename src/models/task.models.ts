/**
 * Task status enum to ensure type safety
 */
export enum TaskStatus {
    TODO = 'todo',
    IN_PROGRESS = 'in-progress',
    DONE = 'done'
  }
  
  /**
   * Task interface defining the structure of a task
   */
  export interface Task {
    id: number;
    description: string;
    status: TaskStatus;
    createdAt: string;
    updatedAt: string;
  }
  
  /**
   * Tasks interface for storing in JSON
   */
  export interface Tasks {
    tasks: Task[];
    lastId: number;
  }