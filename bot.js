require('dotenv').config();

const { Telegraf } = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply('Bem vindo!'))
bot.help((ctx) => ctx.reply('Use /nasa para receber a imagem do dia.'))
bot.command('nasa', (ctx) => ctx.reply('https://www.nasa.gov/sites/default/files/styles/full_width_feature/public/images/672309main_M107_full.jpg'))
bot.hears('oi', (ctx) => ctx.reply('Olá.'))
bot.launch()

//Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
