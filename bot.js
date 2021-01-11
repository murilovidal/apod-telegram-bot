require('dotenv').config();
const { Telegraf } = require('telegraf')
const axios = require('axios');

const URL = 'https://api.nasa.gov/planetary/apod?api_key=' + process.env.API_KEY;
const bot = new Telegraf(process.env.BOT_TOKEN)


async function getData(){
  var urlData = await axios.get(URL);
  return urlData;
};


(async () => {
    const url = await getData();
    bot.start((ctx) => ctx.reply('Bem vindo!'));
    bot.help((ctx) => ctx.reply('Use /nasa para receber a imagem do dia.'));
    if (url.data.media_type == 'image') {
      bot.command('nasa', (ctx) => ctx.replyWithPhoto({url:url.data.url}, {caption: url.data.explanation}) );
    }if (url.data.media_type == 'video') {
      bot.command('nasa', (ctx) => {
        ctx.reply(url.data.url);
        ctx.reply(url.data.explanation);
      });
    }

    bot.hears('oi', (ctx) => ctx.reply('Olá.'));
    bot.launch();
})();
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
