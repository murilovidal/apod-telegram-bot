import { Telegraf } from "telegraf";
import { ApodDatasource } from "../data/datasource/apod.datasource";
import { BotService } from "../service/bot.service";
import { BotMessage } from "../web/bot.message";
import { SendTelegramMessage } from "./send-telegram-message.use-case";
import { UserSubscription } from "./user-subscription.use-case";
import { UserUnsubscription } from "./user-unsubscription.use-case";

export class StartBotCommands {
  private bot: Telegraf;
  private botService: BotService;
  private sendTelegramMessageUseCase: SendTelegramMessage;
  private userSubscriptionUseCase: UserSubscription;
  private userUnsubscriptionUseCase: UserUnsubscription;
  private apodDatasource: ApodDatasource;

  constructor(botService: BotService) {
    this.apodDatasource = new ApodDatasource();
    this.botService = botService;
    this.bot = botService.getBot();
    this.sendTelegramMessageUseCase = new SendTelegramMessage(this.botService);
    this.userSubscriptionUseCase = new UserSubscription();
    this.userUnsubscriptionUseCase = new UserUnsubscription();
    this.userUnsubscriptionUseCase = new UserUnsubscription();
  }

  public startCommands() {
    this.bot.start((ctx) => ctx.reply(BotMessage.Welcome));

    this.bot.command("subscribe", async (ctx) => {
      const user = this.botService.getUserFromCtx(ctx);
      this.sendTelegramMessageUseCase.sendTextToUser(
        user,
        await this.userSubscriptionUseCase.subscribeUser(user)
      );
    });

    this.bot.command("unsubscribe", async (ctx) => {
      const user = this.botService.getUserFromCtx(ctx);
      this.sendTelegramMessageUseCase.sendTextToUser(
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
