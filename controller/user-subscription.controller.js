const { Sequelize, DataTypes, Model } = require("sequelize");
const database = require("../config/database.js");
const sequelize = new Sequelize(database.development);
const UserModel = require("../db/models/user.js");
const User = UserModel(sequelize, Sequelize);
const TelegramService = require("./telegram.service.js");

module.exports = {
  subscribeUser: async function (user) {
    //Criar checkSubscribed em user.model
    let userSubscribed = await User.findOne({
      where: {
        userId: user.userId,
      },
    });
    if (userSubscribed) {
      if (userSubscribed.active) {
        TelegramService.sendTextMessageToUser(
          user,
          "You have already subscribed! To unsubscribe use /unsubscribe"
        );
      } else {
        userSubscribed.active = true;
        await userSubscribed.save();
        TelegramService.sendTextMessageToUser(
          user,
          "Subscription sucessful! You will receive the NASA's Astronomy Picture Of the Day automatically."
        );
      }
    } else {
      try {
        await user.save();
        TelegramService.sendTextMessageToUser(
          user,
          "Subscription sucessful! You will receive the NASA's Astronomy Picture Of the Day automatically."
        );
      } catch (e) {
        console.error(e);
        throw new Error("Unable to complete subscription.");
      }
    }
  },

  unSubscribeUser: async function (user) {
    //improve checkSubscribed
    let userSubscribed = await User.findOne({
      where: {
        userId: user.userId,
        active: true,
      },
    });
    if (userSubscribed) {
      try {
        userSubscribed.active = false;
        await userSubscribed.save();
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
