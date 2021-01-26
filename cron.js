const { Sequelize, DataTypes, Model } = require("sequelize");
const database = require("./config/database.js");
const sequelize = new Sequelize(database.development);
const ApodModel = require("./db/models/apod.js");
const Apod = ApodModel(sequelize, Sequelize);
const ApodData = require("./controller/apod.controller.js");

(async () => {
  apod = await ApodData.getDataFromAPI();
  if (apod) {
    await Apod.destroy({
      where: {},
      truncate: true,
    });
    await apod.save();
  }
})();
