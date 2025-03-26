import { CommandHandler } from './cli/commands';
import { handleError } from './utils/error-handler';

export class App {
  private commandHandler: CommandHandler;

  constructor() {
    console.log("App constructor initialized");
    this.commandHandler = new CommandHandler();
  }

  run(args: string[]): void {
    console.log("App.run called with args:", args);
    try {
      this.commandHandler.executeCommand(args);
    } catch (error) {
      console.log("Error caught in App.run:", error);
      handleError(error as Error);
    }
  }
}