import { Telegraf } from "telegraf";
import { ApodDatasource } from "../data/datasource/apod.datasource";
import { UserSubscription } from "../domain/user-subscription.use-case";
import { UserUnsubscription } from "../domain/user-unsubscription.use-case";
import { BotMessage } from "./bot.message";
import { SendTelegramMessage } from "../domain/send-telegram-message.use-case";
import { BotService } from "../service/bot.service";

export class TelegramPresentation {
  private bot: Telegraf;
  private userSubscriptionUseCase: UserSubscription;
  private userUnsubscriptionUseCase: UserUnsubscription;
  private apodDatasource: ApodDatasource;
  private sendTelegramMessageUseCase: SendTelegramMessage;
  private botService: BotService;

  constructor() {
    this.botService = new BotService();
    this.bot = this.botService.getBot();
    this.apodDatasource = new ApodDatasource();
    this.userSubscriptionUseCase = new UserSubscription();
    this.userUnsubscriptionUseCase = new UserUnsubscription();
    this.userUnsubscriptionUseCase = new UserUnsubscription();
    this.sendTelegramMessageUseCase = new SendTelegramMessage();
  }

  public startBotCommands(): void {
    this.bot.start((ctx) => ctx.reply(BotMessage.Welcome));

    this.bot.command("subscribe", async (ctx) => {
      const user = this.botService.getUserFromCtx(ctx);
      this.sendTelegramMessageUseCase.sendTextMessageToUser(
        user,
        await this.userSubscriptionUseCase.subscribeUser(user)
      );
    });

    this.bot.command("unsubscribe", async (ctx) => {
      const user = this.botService.getUserFromCtx(ctx);
      this.sendTelegramMessageUseCase.sendTextMessageToUser(
        user,
        await this.userUnsubscriptionUseCase.unsubscribeUser(user)
      );
    });

    this.bot.command("image", async (ctx) => {
      const apod = await this.apodDatasource.getApod();
      const user = this.botService.getUserFromCtx(ctx);
      await this.sendTelegramMessageUseCase.sendMediaToUser(user, apod);
    });

    this.bot.command("random", async (ctx) => {
      const user = this.botService.getUserFromCtx(ctx);
      const randomAPOD = await this.apodDatasource.getRandomApod();
      await this.sendTelegramMessageUseCase.sendMediaToUser(user, randomAPOD);
    });

    this.bot.help((ctx) => ctx.reply(BotMessage.Help));

    this.bot.launch();
  }
}
