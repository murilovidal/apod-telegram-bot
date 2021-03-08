import { Telegraf } from "telegraf";
import { Message } from "telegraf/typings/telegram-types";
import { User } from "../data/entity/user.entity";
import { EnvService } from "./env-service";

export class BotService {
  private bot: Telegraf;

  constructor(envService: EnvService) {
    this.bot = new Telegraf(envService.BOT_TOKEN);
  }

  public async sendText(
    telegramId: number,
    messageToUser: string
  ): Promise<Message.TextMessage> {
    return this.bot.telegram.sendMessage(telegramId, messageToUser);
  }

  public async sendMedia(
    telegramId: number,
    url: string,
    caption: string
  ): Promise<Message.PhotoMessage> {
    return this.bot.telegram.sendPhoto(telegramId, url, { caption });
  }

  public getUserFromCtx(ctx: any): User {
    const user = new User();
    user.telegramId = ctx.message.chat.id;
    user.firstName = ctx.message.chat.first_name;
    return user;
  }

  public getBot(): Telegraf {
    return this.bot;
  }
}
