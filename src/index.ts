#!/usr/bin/env node

import { App } from './app';

function main(): void {
  console.log("Starting task-tracker application...");
  
  // Get command line arguments, excluding node and script path
  const args = process.argv.slice(2);
  console.log("Arguments received:", args);
  
  // Create and run the application
  const app = new App();
  app.run(args);
}

// Run the application
main();