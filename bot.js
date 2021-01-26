require("dotenv").config();
const { Sequelize } = require("sequelize");
const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);
const database = require("./config/database.js");
const sequelize = new Sequelize(database.development);
const Subscription = require("./controller/user-subscription.controller.js");
const UserModel = require("./db/models/user.js");
const User = UserModel(sequelize, Sequelize);
const TelegramService = require("./controller/telegram.service.js");
const ApodData = require("./controller/apod.controller.js");

//APOD - Astronomy picture of the day

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

  var dataAPOD;
  try {
    dataAPOD = await ApodData.getDataFromAPI();
  } catch (e) {
    throw new Error("Failed to recover the image of the day. :(");
    console.error(e);
  }

  bot.help((ctx) =>
    ctx.reply(
      "Use /image to receive the picture of the day or /random to receive a random picture."
    )
  );

  bot.command("image", async (ctx) => {
    user = getUserFromCtx(ctx);
    try {
      TelegramService.sendPictureToUser(user, dataAPOD);
    } catch (e) {
      console.error(e);
      TelegramService.sendTextMessageToUser(
        user,
        "Failed to recover the image of the day. :("
      );
    }
  });

  bot.command("random", async (ctx) => {
    user = getUserFromCtx(ctx);
    let randomDataAPOD = null;
    try {
      randomDataAPOD = await ApodData.getRandom();
      TelegramService.sendPictureToUser(user, randomDataAPOD);
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
    await Subscription.subscribeUser(user);
  });

  bot.command("unsubscribe", async (ctx) => {
    user = getUserFromCtx(ctx);
    await Subscription.unSubscribeUser(user);
  });

  bot.hears("hi", (ctx) => ctx.reply("Hello. Use /help for more information."));
  bot.launch();
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
})();
