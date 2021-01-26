"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Apod extends Model {}
  Apod.init(
    {
      url: DataTypes.STRING,
      title: DataTypes.STRING,
      explanation: DataTypes.TEXT,
      media_type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Apod",
    }
  );
  return Apod;
};
