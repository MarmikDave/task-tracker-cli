# Task Tracker CLI

A simple command-line task tracker built with TypeScript. This application helps you manage your tasks from the command line, allowing you to add, update, delete, and track the status of your tasks.

## Features

- Add, update, and delete tasks
- Mark tasks as in-progress or done
- List all tasks or filter by status
- Tasks are stored in a local JSON file

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Build the project:
   ```
   npm run build
   ```
4. Make the CLI globally available (optional):
   ```
   npm link
   ```

## Usage

```bash
# Adding a new task
task-cli add "Buy groceries"

# Updating a task
task-cli update 1 "Buy groceries and cook dinner"

# Deleting a task
task-cli delete 1

# Marking a task as in progress
task-cli mark-in-progress 1

# Marking a task as done
task-cli mark-done 1

# Listing all tasks
task-cli list

# Listing tasks by status
task-cli list todo
task-cli list in-progress
task-cli list done
```

## Task Properties

Each task includes the following properties:
- `id`: A unique identifier for the task
- `description`: A description of the task
- `status`: The status of the task (todo, in-progress, done)
- `createdAt`: When the task was created
- `updatedAt`: When the task was last updated

## File Structure

Tasks are stored in a `tasks.json` file in the current directory. This file is automatically created if it doesn't exist.

## Requirements

- Node.js (14.x or higher recommended)
- npm or yarn