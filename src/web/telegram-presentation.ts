import { Telegraf } from "telegraf";
import { ApodDatasource } from "../data/datasource/apod.datasource";
import { UserSubscription } from "../domain/user-subscription.use-case";
import { UserUnsubscription } from "../domain/user-unsubscription.use-case";
import { EnvService } from "../service/env-service";
import { BotMessage } from "./bot.message";
import { TelegramService } from "../service/telegram.service";

export class TelegramPresentation {
  private bot: Telegraf;
  private userSubscriptionUseCase: UserSubscription;
  private userUnsubscriptionUseCase: UserUnsubscription;
  private apodDatasource: ApodDatasource;
  protected envService: EnvService;
  private telegramService: TelegramService;

  constructor() {
    this.envService = new EnvService();
    this.bot = new Telegraf(this.envService.BOT_TOKEN);
    this.userSubscriptionUseCase = new UserSubscription();
    this.userUnsubscriptionUseCase = new UserUnsubscription();
    this.userUnsubscriptionUseCase = new UserUnsubscription();
    this.apodDatasource = new ApodDatasource();
    this.telegramService = new TelegramService();
  }

  public startBotCommands() {
    this.bot.start((ctx) => ctx.reply(BotMessage.Welcome));

    this.bot.command("subscribe", async (ctx) => {
      const user = this.telegramService.getUserFromCtx(ctx);
      await this.userSubscriptionUseCase.subscribeUser(user);
    });

    this.bot.command("unsubscribe", async (ctx) => {
      const user = this.telegramService.getUserFromCtx(ctx);
      await this.userUnsubscriptionUseCase.unsubscribeUser(user);
    });

    this.bot.command("image", async (ctx) => {
      const apod = await this.apodDatasource.getApod();
      const user = this.telegramService.getUserFromCtx(ctx);
      await this.telegramService.sendMediaToUser(user, apod);
    });

    this.bot.command("random", async (ctx) => {
      const user = this.telegramService.getUserFromCtx(ctx);
      const randomAPOD = await this.apodDatasource.getRandomApod();
      await this.telegramService.sendMediaToUser(user, randomAPOD);
    });

    this.bot.help((ctx) => ctx.reply(BotMessage.Help));

    this.bot.launch();

    process.once("SIGINT", () => this.bot.stop("SIGINT"));
    process.once("SIGTERM", () => this.bot.stop("SIGTERM"));
  }
}
