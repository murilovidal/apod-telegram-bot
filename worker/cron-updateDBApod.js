const { Sequelize } = require("sequelize");
const database = require("../config/database.js");
const sequelize = new Sequelize(database.development);
const ApodModel = require("../db/models/apod.js");
const Apod = ApodModel(sequelize, Sequelize);
const ApodMediaController = require("../controller/apod.controller.js");

(async () => {
  try {
    var apodAPI = await ApodMediaController.getMediaFromAPI();
    var apodDB = await ApodMediaController.getMediaFromDB();
  } catch (e) {
    console.log(e);
    throw new Error("Could'n fetch APOD data.");
  }
  if (apodAPI && apodDB) {
    if (apodDB.title != apod.title) {
      await apod.save();
    }
  }
})();
