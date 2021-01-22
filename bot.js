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

const UserModel = require("./db/models/user.js");
const User = UserModel(sequelize, Sequelize);

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

async function sendPictureToUser(ctx, dataAPOD) {
  try {
    if (dataAPOD.media_type == "image") {
      await ctx.replyWithPhoto(
        { url: dataAPOD.url },
        { caption: dataAPOD.title }
      );
      console.log("PhotoURL sent." + new Date().toLocaleString());
    } else if (dataAPOD.media_type == "video") {
      await ctx.reply({ url: dataAPOD.url }, { caption: dataAPOD.title });
      console.log("VideoURL sent." + new Date().toLocaleString());
    }
    await ctx.reply(dataAPOD.explanation);
  } catch (e) {
    sendTextMessageToUser(ctx, "Failed to recover the picture of the day. :(");
    console.error(e);
  }
}

async function sendPictureToChat(chatId, dataAPOD) {
  try {
    if (dataAPOD.media_type == "image") {
      await bot.telegram.sendPhoto(
        chatId,
        { url: dataAPOD.url },
        { caption: dataAPOD.title }
      );
      console.log(
        "PhotoURL sent to subscribers." + new Date().toLocaleString()
      );
    } else if (dataAPOD.media_type == "video") {
      await bot.telegram.sendMessage(
        chatId,
        { url: dataAPOD.url },
        { caption: dataAPOD.title }
      );
      console.log(
        "VideoURL sent to subscribers." + new Date().toLocaleString()
      );
    }
    await bot.telegram.sendMessage(chatId, dataAPOD.explanation);
  } catch (e) {
    //sendTextMessageToUser(ctx, "Failed to recover the picture of the day. :(");
    console.error(e);
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

async function subscribeUser(ctx) {
  let userSubscribed = await User.findOne({
    where: {
      userId: ctx.message.chat.id,
    },
  });
  if (userSubscribed) {
    sendTextMessageToUser(
      ctx,
      "You have already subscribed! To unsubscribe use /unsubscribe"
    );
  } else {
    try {
      await User.create({
        userName: ctx.message.chat.first_name,
        userId: ctx.message.chat.id,
      });
      sendTextMessageToUser(
        ctx,
        "Subscription sucessful! You will receive the NASA's Astronomy Picture Of the Day automatically."
      );
    } catch (e) {
      console.error(e);
      throw new Error("Unable to complete subscription.");
    }
  }
}

async function unSubscribeUser(ctx) {
  let userSubscribed = await User.findOne({
    where: {
      userId: ctx.message.chat.id,
    },
  });
  if (userSubscribed) {
    try {
      await userSubscribed.destroy();
      sendTextMessageToUser(
        ctx,
        "Unsubscription sucessful! You will NOT receive the NASA's Astronomy Picture Of the Day automatically."
      );
    } catch (e) {
      console.error(e);
      throw new Error(
        "Unable to complete unsubscription. Please try again later."
      );
    }
  } else {
    sendTextMessageToUser(
      ctx,
      "You are not subscribed. To subscribe use /subscribe"
    );
  }
}

async function sendImageToSubscribers() {
  let dataAPOD;
  let users;
  try {
    users = await User.findAll();
    dataAPOD = await getDataFromAPOD(URL);
  } catch (e) {
    console.error(e);
  }
  if (users.length) {
    users.forEach((user, index) => {
      sendPictureToChat(user.userId, dataAPOD);
    });
  }
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

  var schedule = require("node-schedule");
  var jobUpdateDataApod = schedule.scheduleJob(
    "0 12,18,00,06 * * *",
    async () => {
      try {
        dataAPOD = await getDataFromAPOD(URL);
      } catch (e) {
        throw new Error("Failed to recover the image of the day. :(");
        console.error(e);
      }
    }
  );
  var jobImageToSubscribers = schedule.scheduleJob(
    "5 6 * * *",
    sendImageToSubscribers()
  );

  bot.help((ctx) =>
    ctx.reply(
      "Use /image to receive the picture of the day or /random to receive a random picture."
    )
  );

  bot.command("image", async (ctx) => {
    try {
      sendPictureToUser(ctx, dataAPOD);
    } catch (e) {
      console.error(e);
      sendTextMessageToUser(ctx, "Failed to recover the image of the day. :(");
    }
  });

  bot.command("random", async (ctx) => {
    let randomDataAPOD = null;
    try {
      randomDataAPOD = await getDataFromAPOD(URL_RANDOM);
      randomDataAPOD = randomDataAPOD[0];
      sendPictureToUser(ctx, randomDataAPOD);
    } catch (e) {
      console.error(e);
      sendTextMessageToUser(
        ctx,
        "Failed to recover the picture of the day. :("
      );
    }
  });

  bot.command("subscribe", async (ctx) => {
    await subscribeUser(ctx);
  });
  bot.command("unsubscribe", async (ctx) => {
    await unSubscribeUser(ctx);
  });
  bot.hears("hi", (ctx) => ctx.reply("Hello. Use /help for more information."));
  bot.launch();
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
})();
