// task-cli.ts
import * as fs from 'fs';
import * as path from 'path';

// Define the Task interface
interface Task {
  id: number;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  createdAt: string;
  updatedAt: string;
}

// Define the Tasks interface for storing in JSON
interface Tasks {
  tasks: Task[];
  lastId: number;
}

class TaskTracker {
  private tasksFilePath: string;
  private tasks: Tasks;

  constructor() {
    this.tasksFilePath = path.join(process.cwd(), 'tasks.json');
    this.tasks = this.loadTasks();
  }

  // Load tasks from JSON file or initialize if file doesn't exist
  private loadTasks(): Tasks {
    try {
      if (fs.existsSync(this.tasksFilePath)) {
        const data = fs.readFileSync(this.tasksFilePath, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error reading tasks file:', error);
    }
    
    // Return default tasks object if file doesn't exist or is invalid
    return { tasks: [], lastId: 0 };
  }

  // Save tasks to JSON file
  private saveTasks(): void {
    try {
      fs.writeFileSync(this.tasksFilePath, JSON.stringify(this.tasks, null, 2));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }

  // Add a new task
  addTask(description: string): void {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: ++this.tasks.lastId,
      description,
      status: 'todo',
      createdAt: now,
      updatedAt: now
    };

    this.tasks.tasks.push(newTask);
    this.saveTasks();
    console.log(`Task added successfully (ID: ${newTask.id})`);
  }

  // Update an existing task
  updateTask(id: number, description: string): void {
    const task = this.tasks.tasks.find(t => t.id === id);
    
    if (!task) {
      console.error(`Task with ID ${id} not found`);
      return;
    }

    task.description = description;
    task.updatedAt = new Date().toISOString();
    this.saveTasks();
    console.log(`Task ${id} updated successfully`);
  }

  // Delete a task
  deleteTask(id: number): void {
    const taskIndex = this.tasks.tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) {
      console.error(`Task with ID ${id} not found`);
      return;
    }

    this.tasks.tasks.splice(taskIndex, 1);
    this.saveTasks();
    console.log(`Task ${id} deleted successfully`);
  }

  // Mark a task as in progress
  markInProgress(id: number): void {
    const task = this.tasks.tasks.find(t => t.id === id);
    
    if (!task) {
      console.error(`Task with ID ${id} not found`);
      return;
    }

    task.status = 'in-progress';
    task.updatedAt = new Date().toISOString();
    this.saveTasks();
    console.log(`Task ${id} marked as in-progress`);
  }

  // Mark a task as done
  markDone(id: number): void {
    const task = this.tasks.tasks.find(t => t.id === id);
    
    if (!task) {
      console.error(`Task with ID ${id} not found`);
      return;
    }

    task.status = 'done';
    task.updatedAt = new Date().toISOString();
    this.saveTasks();
    console.log(`Task ${id} marked as done`);
  }

  // List tasks based on status filter
  listTasks(filter?: 'todo' | 'in-progress' | 'done'): void {
    let filteredTasks = this.tasks.tasks;
    
    if (filter) {
      filteredTasks = this.tasks.tasks.filter(task => task.status === filter);
    }

    if (filteredTasks.length === 0) {
      console.log('No tasks found');
      return;
    }

    console.log('\nID | Status | Description | Created At | Updated At');
    console.log('-----------------------------------------------------------');
    
    filteredTasks.forEach(task => {
      const createdAt = new Date(task.createdAt).toLocaleString();
      const updatedAt = new Date(task.updatedAt).toLocaleString();
      console.log(`${task.id} | ${task.status} | ${task.description} | ${createdAt} | ${updatedAt}`);
    });
  }
}

function main(): void {
  const taskTracker = new TaskTracker();
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    printUsage();
    return;
  }

  const command = args[0];

  try {
    switch (command) {
      case 'add':
        if (args.length < 2) {
          console.error('Missing task description');
          printUsage();
          return;
        }
        taskTracker.addTask(args[1]);
        break;

      case 'update':
        if (args.length < 3) {
          console.error('Missing task ID or description');
          printUsage();
          return;
        }
        const updateId = parseInt(args[1]);
        if (isNaN(updateId)) {
          console.error('Invalid task ID');
          return;
        }
        taskTracker.updateTask(updateId, args[2]);
        break;

      case 'delete':
        if (args.length < 2) {
          console.error('Missing task ID');
          printUsage();
          return;
        }
        const deleteId = parseInt(args[1]);
        if (isNaN(deleteId)) {
          console.error('Invalid task ID');
          return;
        }
        taskTracker.deleteTask(deleteId);
        break;

      case 'mark-in-progress':
        if (args.length < 2) {
          console.error('Missing task ID');
          printUsage();
          return;
        }
        const inProgressId = parseInt(args[1]);
        if (isNaN(inProgressId)) {
          console.error('Invalid task ID');
          return;
        }
        taskTracker.markInProgress(inProgressId);
        break;

      case 'mark-done':
        if (args.length < 2) {
          console.error('Missing task ID');
          printUsage();
          return;
        }
        const doneId = parseInt(args[1]);
        if (isNaN(doneId)) {
          console.error('Invalid task ID');
          return;
        }
        taskTracker.markDone(doneId);
        break;

      case 'list':
        const filter = args[1] as 'todo' | 'in-progress' | 'done' | undefined;
        if (filter && !['todo', 'in-progress', 'done'].includes(filter)) {
          console.error('Invalid status filter. Use: todo, in-progress, or done');
          return;
        }
        taskTracker.listTasks(filter);
        break;

      default:
        console.error(`Unknown command: ${command}`);
        printUsage();
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

function printUsage(): void {
  console.log(`
Task Tracker CLI - A simple command line task manager

Usage:
  task-cli add "Task description"              - Add a new task
  task-cli update <id> "Updated description"   - Update a task
  task-cli delete <id>                         - Delete a task
  task-cli mark-in-progress <id>               - Mark a task as in progress
  task-cli mark-done <id>                      - Mark a task as done
  task-cli list                                - List all tasks
  task-cli list todo                           - List all todo tasks
  task-cli list in-progress                    - List all in-progress tasks
  task-cli list done                           - List all done tasks
  `);
}

main();


// node dist/task-cli.js add "My first task"
