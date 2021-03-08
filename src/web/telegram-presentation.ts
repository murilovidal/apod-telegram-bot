import { BotService } from "../service/bot.service";
import { StartBotCommands } from "../domain/start-bot-commands.use-case";

export class TelegramPresentation {
  startBotCommands: StartBotCommands;

  constructor(botService: BotService) {
    this.startBotCommands = new StartBotCommands(botService);
  }

  public startBot(): void {
    this.startBotCommands.startCommands();
  }
}
