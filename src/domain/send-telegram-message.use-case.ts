import { Telegraf } from "telegraf";
import { Apod } from "../data/entity/apod.entity";
import { User } from "../data/entity/user.entity";
import { BotService } from "../service/bot.service";
import { EnvService } from "../service/env-service";
import { BotMessage } from "../web/bot.message";

export class SendTelegramMessage {
  private bot: Telegraf;
  private botService: BotService;
  protected envService = new EnvService();

  constructor() {
    this.botService = new BotService();
    this.bot = this.botService.getBot();
  }

  public sendTextMessageToUser(user: User, messageToUser: string): void {
    try {
      this.bot.telegram.sendMessage(user.telegramId, messageToUser);
    } catch (e) {
      console.log(e);
      throw new Error("SendMessage Failed.");
    }
  }

  public async sendMediaToUser(user: User, apod: Apod): Promise<void> {
    try {
      if (apod.mediaType == "image") {
        await this.bot.telegram.sendPhoto(
          user.telegramId,
          { url: apod.url },
          { caption: apod.title }
        );
        console.log("PhotoURL sent." + new Date().toLocaleString());
      } else if (apod.mediaType == "video") {
        try {
          this.sendTextMessageToUser(user, apod.url);
          console.log("VideoURL sent." + new Date().toLocaleString());
        } catch (e) {
          this.sendTextMessageToUser(user, BotMessage.FailedToSendApod);
        }
      }
      this.sendTextMessageToUser(user, apod.explanation);
    } catch (e) {
      this.sendTextMessageToUser(user, BotMessage.FailedToSendApod);
      console.error(e);
    }
  }
}
