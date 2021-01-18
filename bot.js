require("dotenv").config();
const { Telegraf } = require("telegraf");
const axios = require("axios");
const bot = new Telegraf(process.env.BOT_TOKEN);
const URL = process.env.URL_API + process.env.API_KEY;
const URL_RANDOM = process.env.URL_API + process.env.API_KEY + "&count=1";
const ONE_HOUR = (3600 * 10) ^ 3;

//APOD - Astronomy picture of the day
async function getJSONAPOD(urlAPI) {
  try {
    jsonRecovered = await axios.get(urlAPI);
    if (jsonRecovered.data) {
      return jsonRecovered.data;
    } else {
      throw "Json Empty";
    }
  } catch (e) {
    console.error(e);
    throw "Failed to retrieve JSON from " + urlAPI;
  }
}

async function sendImageURL(ctx, json) {
  await ctx.replyWithPhoto({ url: json.url }, { caption: json.title });
  console.log("PhotoURL sent." + new Date().toLocaleString());
}
//Lançar erro nas funções send e tratar na main
async function sendVideoURL(ctx, json) {
  try {
    await ctx.reply({ url: json.url }, { caption: json.title });
    console.log("Random VideoURL sent." + new Date().toLocaleString());
  } catch (e) {
    sendErrorMessageToUser(ctx, "Failed to recover the image of the day. :(");
    console.error(e);
  }
}

//Lançar erro nas funções send e tratar na main
async function sendImageExplanation(ctx, json) {
  try {
    await ctx.reply(json.explanation);
    console.log("Explanation sent." + new Date().toLocaleString());
  } catch (e) {
    console.error(e);
    sendErrorMessageToUser(ctx, "Failed to recover explanation. :(");
  }
}

async function sendErrorMessageToUser(ctx, errorMessageToUser) {
  await ctx.reply(errorMessageToUser);
}

(async () => {
  bot.start((ctx) => ctx.reply("Welcome!"));
  bot.help((ctx) =>
    ctx.reply(
      "Use /image to receive the image of the day from NASA or /random to receive a random image."
    )
  );

  bot.command("image", async (ctx) => {
    let jsonNASA;
    try {
      jsonNASA = await getJSONAPOD(URL);
      if (jsonNASA.media_type == "image") {
        await sendImageURL(ctx, jsonNASA);
        await sendImageExplanation(ctx, jsonNASA);
      } else if (jsonNASA.media_type == "video") {
        await sendVideoURL(ctx, jsonNASA);
        await sendImageExplanation(ctx, jsonNASA);
      }
    } catch (e) {
      console.error(e);
      sendErrorMessageToUser(ctx, "Failed to recover the image of the day. :(");
    }
  });

  bot.command("random", async (ctx) => {
    let jsonRandomImageNasa = null;
    try {
      jsonRandomImageNasa = await getJSONAPOD(URL_RANDOM);
      jsonRandomImageNasa = jsonRandomImageNasa[0];
      if (jsonRandomImageNasa.media_type == "image") {
        await sendImageURL(ctx, jsonRandomImageNasa);
        await sendImageExplanation(ctx, jsonRandomImageNasa);
      } else if (jsonRandomImageNasa.media_type == "video") {
        await sendVideoURL(ctx, jsonRandomImageNasa);
        await sendImageExplanation(ctx, jsonRandomImageNasa);
      }
    } catch (e) {
      console.error(e);
      sendErrorMessageToUser(ctx, "Failed to recover the image of the day. :(");
    }
  });

  bot.hears("hi", (ctx) => ctx.reply("Hello. Use /help for more information."));
  bot.launch();
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
})();
