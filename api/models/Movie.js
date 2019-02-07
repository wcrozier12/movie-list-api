const Sequelize = require("sequelize");
const db = require("../database");
const Service = require("./Service");
const Movie = db.define("movie", {
  title: {
    type: Sequelize.STRING
  },
  imgSmall: {
    type: Sequelize.STRING,
    field: "img_small"
  },
  imgMedium: {
    type: Sequelize.STRING,
    field: "img_medium"
  },
  imgLarge: {
    type: Sequelize.STRING,
    field: "img_large"
  },
  imgExtraLarge: {
    type: Sequelize.STRING,
    field: "img_extra_large"
  },
  imdbId: {
    type: Sequelize.STRING,
    field: "imdb_id"
  },
  releaseDate: {
    type: Sequelize.DATE,
    field: "release_date"
  },
  rottenTomatoesId: {
    type: Sequelize.STRING,
    field: "rotten_tomatoes_id"
  },
  rating: {
    type: Sequelize.STRING,
    field: "rating"
  },
  wikipediaId: {
    type: Sequelize.STRING,
    field: "wikipedia_id"
  },
  createdAt: {
    type: Sequelize.DATE,
    field: "created_at"
  },
  updatedAt: {
    type: Sequelize.DATE,
    field: "updated_at"
  }
});

module.exports = Movie;
