import { Telegraf } from "telegraf";
import { Apod } from "../data/entity/apod.entity";
import { User } from "../data/entity/user.entity";
import { EnvService } from "./env-service";
import { BotMessage } from "../web/bot.message";

export class TelegramService {
  private bot: Telegraf;
  protected envService = new EnvService();

  constructor() {
    this.bot = new Telegraf(this.envService.BOT_TOKEN);
  }

  public sendTextMessageToUser(user: User, messageToUser: string) {
    try {
      this.bot.telegram.sendMessage(user.telegramId, messageToUser);
    } catch (e) {
      console.log(e);
      throw new Error("SendMessage Failed.");
    }
  }

  public getUserFromCtx(ctx: any): User {
    const user = new User();
    user.telegramId = ctx.message.chat.id;
    user.firstName = ctx.message.chat.first_name;
    return user;
  }

  public async sendMediaToUser(user: User, apod: Apod) {
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
