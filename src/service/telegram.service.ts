import { Telegraf } from "telegraf";
import { ApodDatasource } from "../data/datasource/apod.datasource";
import { Apod } from "../data/entity/apod.entity";
import { User } from "../data/entity/user.entity";
import { EnvService } from "./env-service";
import { UserSubscription } from "../domain/user-subscription.use-case";
import { UserUnsubscription } from "../domain/user-unsubscription.use-case";

export class TelegramService {
  private bot: Telegraf;
  private userSubscriptionUseCase: UserSubscription;
  private userUnsubscriptionUseCase: UserUnsubscription;
  private apodDatasource: ApodDatasource;
  protected envService = new EnvService();

  constructor() {
    this.bot = new Telegraf(this.envService.BOT_TOKEN);
    this.userSubscriptionUseCase = new UserSubscription();
    this.userUnsubscriptionUseCase = new UserUnsubscription();
    this.userUnsubscriptionUseCase = new UserUnsubscription();
    this.apodDatasource = new ApodDatasource();
  }

  start() {
    this.bot.start((ctx) =>
      ctx.reply(
        "Welcome! This bot retrieves the NASA's Picture of the Day on command. Use /image to receive the picture of the day from NASA or /random to receive a random picture"
      )
    );

    this.bot.command("subscribe", async (ctx) => {
      const user = this.getUserFromCtx(ctx);
      try {
        await this.userSubscriptionUseCase.subscribeUser(user);
        this.sendTextMessageToUser(
          user,
          "Subscription successful! You will receive the NASA's Astronomy Picture Of the Day automatically."
        );
      } catch (error) {
        if ((error = "User already subscribed.")) {
          this.sendTextMessageToUser(
            user,
            "You are already subscribed! To unsubscribe use /unsubscribe."
          );
        } else {
          console.error(error);
          this.sendTextMessageToUser(
            user,
            "Unable to complete subscription. Please try again later."
          );
        }
      }
    });

    this.bot.command("unsubscribe", async (ctx) => {
      const user = this.getUserFromCtx(ctx);
      try {
        await this.userUnsubscriptionUseCase.unsubscribeUser(user);
        this.sendTextMessageToUser(
          user,
          "Unsubscription successful! You will NOT receive the NASA's Astronomy Picture Of the Day automatically."
        );
      } catch (error) {
        console.error(error);
        this.sendTextMessageToUser(
          user,
          "Unable to complete unsubscription. Please try again later."
        );
      }
    });

    this.bot.command("image", async (ctx) => {
      let apod;
      let user = this.getUserFromCtx(ctx);
      try {
        apod = await this.apodDatasource.getApod();
        try {
          await this.sendMediaToUser(user, apod);
        } catch (e) {
          console.error(e);
          this.sendTextMessageToUser(
            user,
            "Failed to recover the image of the day. :("
          );
        }
      } catch (e) {
        this.sendTextMessageToUser(
          user,
          "Failed to recover the image of the day. :("
        );
        console.error(e);
      }
    });

    this.bot.command("random", async (ctx) => {
      let user = this.getUserFromCtx(ctx);
      let randomDataAPOD = null;
      try {
        randomDataAPOD = await this.apodDatasource.getRandomApod();
        this.sendMediaToUser(user, randomDataAPOD);
      } catch (e) {
        console.error(e);
        this.sendTextMessageToUser(
          user,
          "Failed to recover the picture of the day. :("
        );
      }
    });

    this.bot.help((ctx) =>
      ctx.reply(
        "Use /image to receive the picture of the day or /random to receive a random picture."
      )
    );
    this.bot.launch();
    process.once("SIGINT", () => this.bot.stop("SIGINT"));
    process.once("SIGTERM", () => this.bot.stop("SIGTERM"));
  }

  private sendTextMessageToUser(user: User, messageToUser: string) {
    try {
      this.bot.telegram.sendMessage(user.telegramId, messageToUser);
    } catch (e) {
      console.log(e);
      throw new Error("SendMessage Failed.");
    }
  }

  private async sendMediaToUser(user: User, apod: Apod) {
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
          this.bot.telegram.sendMessage(user.telegramId, apod.url);
          console.log("VideoURL sent." + new Date().toLocaleString());
        } catch (e) {
          this.bot.telegram.sendMessage(
            user.telegramId,
            "Failed to recover the picture of the day. :("
          );
        }
      }
      this.bot.telegram.sendMessage(user.telegramId, apod.explanation);
    } catch (e) {
      module.exports.sendTextMessageToUser(
        user,
        "Failed to recover the picture of the day. :("
      );
      console.error(e);
    }
  }

  async sendMediaToUsers(apod: Apod) {
    const users = await this.userSubscriptionUseCase.getAllSubscribers();

    if (users.length) {
      await Promise.all(users.map((user) => this.sendMediaToUser(user, apod)));
    }
  }

  private getUserFromCtx(ctx: any) {
    let user = new User();
    user.telegramId = ctx.message.chat.id;
    user.firstName = ctx.message.chat.first_name;
    return user;
  }
}
