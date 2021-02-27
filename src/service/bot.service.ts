import { Telegraf } from "telegraf";
import { User } from "../data/entity/user.entity";
import { EnvService } from "./env-service";

export class BotService {
  private bot: Telegraf;
  protected envService = new EnvService();

  constructor() {
    this.bot = new Telegraf(this.envService.BOT_TOKEN);
  }

  public getBot(): Telegraf {
    return this.bot;
  }

  public getUserFromCtx(ctx: any): User {
    const user = new User();
    user.telegramId = ctx.message.chat.id;
    user.firstName = ctx.message.chat.first_name;
    return user;
  }
}
