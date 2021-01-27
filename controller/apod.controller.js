const { Sequelize, DataTypes, Model } = require("sequelize");
const database = require("../config/database.js");
const sequelize = new Sequelize(database.development);
const ApodModel = require("../db/models/apod.js");
const Apod = ApodModel(sequelize, Sequelize);
const axios = require("axios");
const URL = process.env.URL_API + process.env.API_KEY;
const URL_RANDOM = process.env.URL_API + process.env.API_KEY + "&count=1";

async function getAPODData(url) {
  try {
    dataRecovered = await axios.get(url);
    if (dataRecovered.data.length) {
      apod = Apod.build({
        url: dataRecovered.data[0].url,
        title: dataRecovered.data[0].title,
        explanation: dataRecovered.data[0].explanation,
        media_type: dataRecovered.data[0].media_type,
      });
      return apod;
    } else if (dataRecovered.data) {
      apod = Apod.build({
        url: dataRecovered.data.url,
        title: dataRecovered.data.title,
        explanation: dataRecovered.data.explanation,
        media_type: dataRecovered.data.media_type,
      });
      return apod;
    } else {
      throw new Error("Unable to recover data.");
    }
  } catch (e) {
    console.error(e);
    throw new Error("Failed to retrieve data from " + urlAPI);
  }
}

module.exports = {
  getMediaFromAPI: async function () {
    return getAPODData(URL);
  },
  getRandomMedia: async function () {
    return getAPODData(URL_RANDOM);
  },
  getMediaFromDB: async function () {
    return Apod.findOne({
      order: [["createdAt", "DESC"]],
    });
  },
  store: async function (ApodData) {
    try {
      await Apod.create({
        url: ApodData.url,
        title: ApodData.title,
        explanation: ApodData.explanation,
      });
    } catch (e) {
      console.log(e);
      throw new Error("Unable to store APOD in database.");
    }
  },
};
