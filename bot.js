require('dotenv').config();
const { Telegraf } = require('telegraf')
const axios = require('axios');
const bot = new Telegraf(process.env.BOT_TOKEN)

const URL = process.env.URL_API + process.env.API_KEY;
const URL_RANDOM = process.env.URL_API + process.env.API_KEY + '&count=1';

const ONE_HOUR = 3600*10^3;

//APOD - Astronomy picture of the day
async function getJSONAPOD(url){
  try {
    return axios.get(url);
  } catch (e) {
    console.log(e);
    throw 'Failed to retrieve JSON from ' + url;
  }
};

async function sendImageURL(ctx, json) {
  if (json.data[0]) {
    await ctx.replyWithPhoto({url:json.data[0].url}, {caption: json.data[0].title});
    console.log("Random PhotoURL sent.");
  }else {
    await ctx.replyWithPhoto({url:json.data.url}, {caption: json.data.title});
    console.log("PhotoURL sent.");
  }
};
//Lançar erro nas funções send e tratar na main
async function sendVideoURL(ctx, json) {
  if (Array.isArray(json)) {
    try {
      await ctx.reply({url:json.data[0].url}, {caption: json.data[0].title});
      await ctx.reply(json.data[0].explanation);
      console.log("Random VideoURL sent.");
    } catch (e) {
      await ctx.reply('Falha ao recuperar a imagem do dia. :(');
      console.log("Falhou.");
      console.log(e);
    }
    await ctx.reply({url:json.data[0].url}, {caption: json.data[0].title});
    await ctx.reply(json.data[0].explanation);
    console.log("Random VideoURL sent.");
  }else {
    try {
      await ctx.reply({url:json.data.url}, {caption: json.data.title});
      await ctx.reply(json.data.explanation);
      console.log("VideoURL sent.");
    } catch (e) {
      await ctx.reply('Falha ao recuperar a imagem do dia. :(');
      console.log("Falhou.");
      console.log(e);
    }
  }
};
//Lançar erro nas funções send e tratar na main
async function sendImageExplanation(ctx, json) {
  if (json.data[0]) {
    try {
      await ctx.reply(json.data[0].explanation);
      console.log("Random explanation sent.");
    } catch (e) {
      await ctx.reply('Falha ao recuperar a imagem do dia. :(');
      console.log("Falhou.");
      console.log(e);
    }
  } else {
    try {
      await ctx.reply(json.data.explanation);
      console.log("Explanation sent.");
    } catch (e) {
      await ctx.reply('Falha ao recuperar a imagem do dia. :(');
      console.log("Falhou.");
      console.log(e);
    }
  }
};

(async () => {

    let jsonNASA;
    try {
      jsonNASA = await getJSONAPOD(URL);
    } catch (e) {
      jsonNASA = null;
    };
    //Atualizar JSON a cada hora
    setInterval(async function(){
      try {
        jsonNASA = await getJSONAPOD(URL);
      } catch (e) {
        jsonNASA = null;;
    };}, ONE_HOUR);

    bot.start((ctx) => ctx.reply('Bem vindo!'));
    bot.help((ctx) => ctx.reply('Use /imagem para receber a imagem do dia ou /random para receber uma imagem aleatória.'));

    bot.command('imagem', async (ctx) => {
      if (jsonNASA) {
        if (jsonNASA.data.media_type == 'image') {
          await sendImageURL(ctx, jsonNASA);
          await sendImageExplanation(ctx, jsonNASA);
        }else if (jsonNASA.data.media_type == 'video') {
          await sendVideoURL(ctx, jsonNASA);
        }
      }else{
        await ctx.reply('Falha ao recuperar a imagem do dia. :(');
      }
    });

    bot.command('random',async (ctx)=> {
      let jsonRandom;
      try {
        jsonRandom = await getJSONAPOD(URL_RANDOM);
      } catch (e) {
        jsonRandom = null;
      };
      if (jsonRandom) {
        if (jsonRandom.data[0].media_type == 'image') {
          await sendImageURL(ctx, jsonRandom);
          await sendImageExplanation(ctx, jsonRandom);
        }else if (jsonRandom.data[0].media_type == 'video') {
          await sendVideoURL(ctx, jsonRandom);
          await sendImageExplanation(ctx, jsonRandom);
        }
      } else {
        await ctx.reply('Falha ao recuperar a imagem do dia. :(');
      };
    });
    bot.hears('oi', (ctx) => ctx.reply('Olá. Use /help para mais informações.'));
    bot.launch();
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
})();
