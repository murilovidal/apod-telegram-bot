const { Sequelize, DataTypes, Model } = require("sequelize");
const database = require("../config/database.js");
const sequelize = new Sequelize(database.development);
const UserModel = require("../db/models/user.js");
const User = UserModel(sequelize, Sequelize);
const TelegramService = require("./telegram.service.js");

module.exports = {
  subscribeUser: async function (user) {
    const [newUser, created] = await User.findOrCreate({
      where: { userId: user.userId },
      defaults: {
        userId: user.userId,
        userName: user.userName,
      },
      paranoid: false,
    });
    if (created) {
      TelegramService.sendTextMessageToUser(
        newUser,
        "Subscription sucessful! You will receive the NASA's Astronomy Picture Of the Day automatically."
      );
    } else if (newUser.deletedAt) {
      newUser.restore();
      TelegramService.sendTextMessageToUser(
        newUser,
        "Subscription sucessful! You will receive the NASA's Astronomy Picture Of the Day automatically."
      );
    } else {
      TelegramService.sendTextMessageToUser(
        newUser,
        "You are already subscribed! To unsubscribe use /unsubscribe"
      );
    }
  },

  unSubscribeUser: async function (user) {
    //improve checkSubscribed
    let userSubscribed = await User.findOne({
      where: {
        userId: user.userId,
      },
    });
    if (userSubscribed) {
      try {
        await userSubscribed.destroy();
        TelegramService.sendTextMessageToUser(
          user,
          "Unsubscription sucessful! You will NOT receive the NASA's Astronomy Picture Of the Day automatically."
        );
      } catch (e) {
        console.error(e);
        throw new Error(
          "Unable to complete unsubscription. Please try again later."
        );
      }
    } else {
      TelegramService.sendTextMessageToUser(
        user,
        "You are not subscribed. To subscribe use /subscribe"
      );
    }
  },
};
