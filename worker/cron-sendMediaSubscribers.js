const { Sequelize } = require("sequelize");
const database = require("../config/database.js");
const sequelize = new Sequelize(database.development);
const ApodMediaController = require("../controller/apod.controller.js");
const UserModel = require("../db/models/user.js");
const User = UserModel(sequelize, Sequelize);
const TelegramService = require("../controller/telegram.service.js");

(async () => {
  let users = await User.findAll();
  let apodMedia = await ApodMediaController.getMediaFromDB();
  TelegramService.sendMediaToUsers(users, apodMedia);
})();
