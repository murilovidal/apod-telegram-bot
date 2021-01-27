require("dotenv").config();
const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);

module.exports = {
  sendTextMessageToUser: async function (user, messageToUser) {
    try {
      await bot.telegram.sendMessage(user.userId, messageToUser);
    } catch (e) {
      console.log(e);
      throw new Error("SendMessage Failed.");
    }
  },
  sendMediaToUser: async function (user, dataAPOD) {
    try {
      if (dataAPOD.media_type == "image") {
        await bot.telegram.sendPhoto(
          user.userId,
          { url: dataAPOD.url },
          { caption: dataAPOD.title }
        );
        console.log("PhotoURL sent." + new Date().toLocaleString());
      } else if (dataAPOD.media_type == "video") {
        try {
          await bot.telegram.sendMessage(user.userId, dataAPOD.url);
          console.log("VideoURL sent." + new Date().toLocaleString());
        } catch (e) {
          await bot.telegram.sendMessage(
            user.userId,
            "Failed to recover the picture of the day. :("
          );
        }
      }
      await bot.telegram.sendMessage(user.userId, dataAPOD.explanation);
    } catch (e) {
      module.exports.sendTextMessageToUser(
        user,
        "Failed to recover the picture of the day. :("
      );
      console.error(e);
    }
  },
  sendMediaToUsers: async function (users, dataAPOD) {
    if (users.length) {
      await Promise.all(
        users.map((u) => module.exports.sendMediaToUser(u, dataAPOD))
      );
    } else {
      module.exports.sendMediaToUser(users, dataAPOD);
    }
  },
};
