require("dotenv").config();
const { Sequelize } = require("sequelize");
const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);
const database = require("./config/database.js");
const sequelize = new Sequelize(database.development);
const SubscriptionController = require("./controller/user-subscription.controller.js");
const UserModel = require("./db/models/user.js");
const User = UserModel(sequelize, Sequelize);
const TelegramService = require("./controller/telegram.service.js");
const ApodDataController = require("./controller/apod.controller.js");

function getUserFromCtx(ctx) {
  return User.build({
    userId: ctx.message.chat.id,
    userName: ctx.message.chat.first_name,
  });
}

(async () => {
  bot.start((ctx) =>
    ctx.reply(
      "Welcome! This bot retrieves the NASA's Picture of the Day on command. Use /image to receive the picture of the day from NASA or /random to receive a random picture"
    )
  );

  bot.help((ctx) =>
    ctx.reply(
      "Use /image to receive the picture of the day or /random to receive a random picture."
    )
  );

  bot.command("image", async (ctx) => {
    let dataAPOD;
    let user = getUserFromCtx(ctx);
    try {
      dataAPOD = await ApodDataController.getMediaFromDB();
    } catch (e) {
      TelegramService.sendTextMessageToUser(
        user,
        "Failed to recover the image of the day. :("
      );
      throw new Error("Failed to recover the image of the day. :(");
      console.error(e);
    }
    try {
      TelegramService.sendMediaToUser(user, dataAPOD);
    } catch (e) {
      console.error(e);
      TelegramService.sendTextMessageToUser(
        user,
        "Failed to recover the image of the day. :("
      );
    }
  });

  bot.command("random", async (ctx) => {
    let user = getUserFromCtx(ctx);
    let randomDataAPOD = null;
    try {
      randomDataAPOD = await ApodDataController.getRandomMedia();
      TelegramService.sendMediaToUser(user, randomDataAPOD);
    } catch (e) {
      console.error(e);
      TelegramService.sendTextMessageToUser(
        user,
        "Failed to recover the picture of the day. :("
      );
    }
  });

  bot.command("subscribe", async (ctx) => {
    user = getUserFromCtx(ctx);
    await SubscriptionController.subscribeUser(user);
  });

  bot.command("unsubscribe", async (ctx) => {
    user = getUserFromCtx(ctx);
    await SubscriptionController.unSubscribeUser(user);
  });

  bot.hears("hi", (ctx) => ctx.reply("Hello. Use /help for more information."));
  bot.launch();
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
})();
