require("dotenv").config();
import { Telegraf } from "telegraf";

const bot = new Telegraf(<string>process.env.BOT_TOKEN);

bot.on("text", (ctx) => {
  ctx.reply(`Hello ${ctx.state.role}`);
});
