require('dotenv').config();
const { Telegraf } = require('telegraf')
const axios = require('axios');

const URL = 'https://api.nasa.gov/planetary/apod?api_key=' + process.env.API_KEY;
const URL_RANDOM = 'https://api.nasa.gov/planetary/apod?api_key=' + process.env.API_KEY + '&count=1';
const bot = new Telegraf(process.env.BOT_TOKEN)

//APOD - Astronomy picture of the day
async function getJSONAPOD(url){
  try {
    return axios.get(url);
  } catch (e) {
    console.log(e);
  }
};


(async () => {
    let jsonNASA = await getJSONAPOD(URL);
    //Atualizar JSON a cada hora
    setInterval(async function(){ jsonNASA = await getJSONAPOD(URL); }, 3600*10^3);

    bot.start((ctx) => ctx.reply('Bem vindo!'));
    bot.help((ctx) => ctx.reply('Use /imagem para receber a imagem do dia ou /random para receber uma imagem aleatória.'));
    bot.command('random',async (ctx)=> {
      let jsonRandom = await getJSONAPOD(URL_RANDOM);
      if (jsonRandom.data[0].media_type == 'image') {
        await ctx.replyWithPhoto({url:jsonRandom.data[0].hdurl}, {caption: jsonRandom.data[0].title});
        ctx.reply(jsonRandom.data[0].explanation);
      }
      if (jsonRandom.data[0].media_type == 'video') {
        ctx.reply({url:jsonRandom.data[0].url}, {caption: jsonRandom.data[0].title});
        ctx.reply(jsonRandom.data[0].explanation);
      }
    });
    if (jsonNASA.data.media_type == 'image') {
      bot.command('imagem', (ctx) => {
        await ctx.replyWithPhoto({url:jsonNASA.data.hdurl}, {caption: jsonNASA.data.title});
        ctx.reply(jsonNASA.data.explanation);
      });
    }
    if (jsonNASA.data.media_type == 'video') {
      bot.command('imagem', (ctx) => {
        ctx.reply(jsonNASA.data.url);
        ctx.reply(jsonNASA.data.title);
        ctx.reply(jsonNASA.data.explanation);
      });
    };

    bot.hears('oi', (ctx) => ctx.reply('Olá. Use /help para mais informações.'));
    bot.launch();
    process.once('SIGINT', () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))
})();
