import * as path from 'path';
import * as fs from 'fs';

// Find the project root by looking for package.json
function findProjectRoot(): string {
  let currentDir = process.cwd();
  
  while (!fs.existsSync(path.join(currentDir, 'package.json'))) {
    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      // We've reached the root of the filesystem without finding package.json
      return process.cwd();
    }
    currentDir = parentDir;
  }
  
  return currentDir;
}

const projectRoot = findProjectRoot();

export const config = {
  // Save in project root
  tasksFilePath: path.join(projectRoot, 'tasks.json'),
  
  appName: 'task-tracker-cli',
  logLevel: process.env.LOG_LEVEL || 'info',
  debug: process.env.DEBUG === 'true'
};