require("dotenv").config();
import { Telegraf } from "telegraf";
import { User } from "../data/entity/user.entity";
import { UserSubscription } from "../domain/user-subscription.use-case";
import { UserUnsubscription } from "../domain/user-unsubscription.use-case";

export class TelegramService {
  bot: Telegraf;
  userSubscription: UserSubscription;
  userUnsubscription: UserUnsubscription;

  constructor() {
    this.bot = new Telegraf(<string>process.env.BOT_TOKEN);
    this.userSubscription = new UserSubscription();
    this.userUnsubscription = new UserUnsubscription();
  }
  sendTextMessageToUser(user: User, messageToUser: string) {
    try {
      this.bot.telegram.sendMessage(user.telegramId, messageToUser);
    } catch (error) {
      console.error(error);
      throw new Error("SendMessage Failed.");
    }
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
        await this.userSubscription.subscribeUser(user);
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
        await this.userUnsubscription.unsubscribeUser(user);
        this.sendTextMessageToUser(
          user,
          "Unsubscription sucessful! You will NOT receive the NASA's Astronomy Picture Of the Day automatically."
        );
      } catch (error) {
        console.error(error);
        this.sendTextMessageToUser(
          user,
          "Unable to complete unsubscription. Please try again later."
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

  protected getUserFromCtx(ctx: any) {
    const user = new User();
    user.telegramId = ctx.message.chat.id;
    user.firstName = ctx.message.chat.first_name;
    return user;
  }
}
