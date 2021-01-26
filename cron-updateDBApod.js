const { Sequelize } = require("sequelize");
const database = require("./config/database.js");
const sequelize = new Sequelize(database.development);
const ApodModel = require("./db/models/apod.js");
const Apod = ApodModel(sequelize, Sequelize);
const ApodData = require("./controller/apod.controller.js");
const UserModel = require("./db/models/user.js");
const User = UserModel(sequelize, Sequelize);
const TelegramService = require("./controller/telegram.service.js");

(async () => {
  try {
    apod = await ApodData.getDataFromAPI();
    apodDB = await Apod.findOne();
  } catch (e) {
    console.log(e);
    throw new Error("Could'n fetch APOD data.");
  }
  if (apod && apodDB) {
    if (apodDB.title != apod.title) {
      await Apod.destroy({
        where: {},
        truncate: true,
      });
      await apod.save();
      users = await User.findAll();
      TelegramService.sendPictureToUsers(users, apodDB);
    }
  }
})();
