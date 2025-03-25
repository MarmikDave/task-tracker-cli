import chalk from 'chalk';
import { config } from '../config/config';

/**
 * Print usage information for the CLI
 */
export function printUsage(): void {
  console.log(`
${chalk.bold(config.appName)} - A command-line task tracking application

${chalk.bold('USAGE:')}
  ${config.appName} <command> [options]

${chalk.bold('COMMANDS:')}
  ${chalk.green('add')} <description>              Add a new task
  ${chalk.green('update')} <id> <description>      Update a task description
  ${chalk.green('delete')} <id>                    Delete a task
  ${chalk.green('start')} <id>                     Mark a task as in-progress
  ${chalk.green('complete')} <id>                  Mark a task as done
  ${chalk.green('list')} [status]                  List tasks (status: todo, in-progress, done)
  ${chalk.green('help')}                           Show this help information

${chalk.bold('EXAMPLES:')}
  ${config.appName} add "Implement new feature"
  ${config.appName} list todo
  ${config.appName} start 1
  ${config.appName} complete 2
  ${config.appName} delete 3
  `);
}