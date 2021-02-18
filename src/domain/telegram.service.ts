require("dotenv").config();
import { Telegraf } from "telegraf";
import { User } from "../data/entity/user.entity";
import { UserSubscription } from "./user-subscription.use-case";

const bot = new Telegraf(<string>process.env.BOT_TOKEN);
const userSubscription = new UserSubscription();

export class TelegramService {
  sendTextMessageToUser(user: User, messageToUser: string) {
    try {
      bot.telegram.sendMessage(user.id, messageToUser);
    } catch (e) {
      console.log(e);
      throw new Error("SendMessage Failed.");
    }
  }

  start() {
    bot.start((ctx) =>
      ctx.reply(
        "Welcome! This bot retrieves the NASA's Picture of the Day on command. Use /image to receive the picture of the day from NASA or /random to receive a random picture"
      )
    );

    bot.command("subscribe", async (ctx) => {
      const user = this.getUserFromCtx(ctx);
      try {
        await userSubscription.subscribeUser(user);
        this.sendTextMessageToUser(
          user,
          "Subscription sucessful! You will receive the NASA's Astronomy Picture Of the Day automatically."
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

    bot.command("unsubscribe", async (ctx) => {
      const user = this.getUserFromCtx(ctx);
      try {
        await userSubscription.unsubscribeUser(user);
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

    bot.help((ctx) =>
      ctx.reply(
        "Use /image to receive the picture of the day or /random to receive a random picture."
      )
    );
    bot.launch();
    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));
  }

  protected getUserFromCtx(ctx: any) {
    const user = new User();
    user.id = ctx.message.chat.id;
    user.firstName = ctx.message.chat.first_name;
    return user;
  }
}
