require("dotenv").config();
const { Sequelize, DataTypes, Model } = require("sequelize");
const { Telegraf } = require("telegraf");
const axios = require("axios");
const bot = new Telegraf(process.env.BOT_TOKEN);
const URL = process.env.URL_API + process.env.API_KEY;
const URL_RANDOM = process.env.URL_API + process.env.API_KEY + "&count=1";
const ONE_HOUR = (3600 * 10) ^ 3;
const database = require("./config/database.js");
const sequelize = new Sequelize(database.development);
const Subscription = require("./controller/user-subscription.controller.js");
const UserModel = require("./db/models/user.js");
const User = UserModel(sequelize, Sequelize);
const TelegramService = require("./controller/telegram.service.js");

//APOD - Astronomy picture of the day
async function getDataFromAPOD(urlAPI) {
  try {
    dataRecovered = await axios.get(urlAPI);
    if (dataRecovered.data) {
      return dataRecovered.data;
    } else {
      throw new Error("Json Empty");
    }
  } catch (e) {
    console.error(e);
    throw new Error("Failed to retrieve data from " + urlAPI);
  }
}

async function sendTextMessageToUser(ctx, messageToUser) {
  await ctx.reply(messageToUser);
}

async function authenticateDB() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

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
    dataAPOD = await getDataFromAPOD(URL);
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
      randomDataAPOD = await getDataFromAPOD(URL_RANDOM);
      randomDataAPOD = randomDataAPOD[0];
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
