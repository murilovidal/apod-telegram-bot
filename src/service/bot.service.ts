import { Telegraf } from "telegraf";
import { User } from "../data/entity/user.entity";
import { EnvService } from "./env-service";

export class BotService {
  private bot: Telegraf;

  constructor(envService: EnvService) {
    this.bot = new Telegraf(envService.BOT_TOKEN);
  }

  public sendText(telegramId: number, messageToUser: string): void {
    this.bot.telegram.sendMessage(telegramId, messageToUser);
  }

  public sendMedia(
    telegramId: number,
    url: string,
    caption: { caption: string }
  ) {
    this.bot.telegram.sendPhoto(telegramId, url, caption);
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
