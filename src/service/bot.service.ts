import { Telegraf } from "telegraf";
import { User } from "../data/entity/user.entity";
import { EnvService } from "./env-service";

export class BotService {
  private bot: Telegraf;
  private envService: EnvService;

  constructor() {
    this.envService = new EnvService();
    this.bot = new Telegraf(this.envService.BOT_TOKEN);
  }

  public async sendText(telegramId: number, messageToUser: string) {
    await this.bot.telegram.sendMessage(telegramId, messageToUser);
  }

  public async sendMedia(
    telegramId: number,
    url: { url: string },
    caption: { caption: string }
  ) {
    await this.bot.telegram.sendPhoto(telegramId, url, caption);
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
