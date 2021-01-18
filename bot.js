require("dotenv").config();
const { Telegraf } = require("telegraf");
const axios = require("axios");
const bot = new Telegraf(process.env.BOT_TOKEN);
const URL = process.env.URL_API + process.env.API_KEY;
const URL_RANDOM = process.env.URL_API + process.env.API_KEY + "&count=1";
const ONE_HOUR = (3600 * 10) ^ 3;

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
    throw "Failed to retrieve data from " + urlAPI;
  }
}

async function sendPictureToUser(ctx, dataAPOD) {
  try {
    if (dataAPOD.media_type == "image") {
      await ctx.replyWithPhoto(
        { url: dataAPOD.url },
        { caption: dataAPOD.title }
      );
      await ctx.reply(dataAPOD.explanation);
      console.log("PhotoURL sent." + new Date().toLocaleString());
    } else if (dataAPOD.media_type == "video") {
      await ctx.reply({ url: dataAPOD.url }, { caption: dataAPOD.title });
      await ctx.reply(dataAPOD.explanation);
      console.log("VideoURL sent." + new Date().toLocaleString());
    }
  } catch (e) {
    sendErrorMessageToUser(ctx, "Failed to recover the picture of the day. :(");
    console.error(e);
  }
}

async function sendErrorMessageToUser(ctx, errorMessageToUser) {
  await ctx.reply(errorMessageToUser);
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
    try {
      dataAPOD = await getDataFromAPOD(URL);
      sendPictureToUser(ctx, dataAPOD);
    } catch (e) {
      console.error(e);
      sendErrorMessageToUser(ctx, "Failed to recover the image of the day. :(");
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
      sendErrorMessageToUser(
        ctx,
        "Failed to recover the picture of the day. :("
      );
    }
  });

  bot.hears("hi", (ctx) => ctx.reply("Hello. Use /help for more information."));
  bot.launch();
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
})();
