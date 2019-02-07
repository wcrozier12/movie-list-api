const Sequelize = require("sequelize");
const db = require("../database");
const Service = require("./Service");
const MoviesServices = db.define(
  "movies_services",
  {
    movieId: {
      type: Sequelize.STRING,
      primaryKey: true,
      field: "movie_id"
    },
    serviceId: {
      type: Sequelize.STRING,
      field: "service_id"
    },
    servicePopularity: {
      type: Sequelize.INTEGER,
      field: "service_popularity"
    }
  },
  { timestamps: false }
);

module.exports = MoviesServices;
