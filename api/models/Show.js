const Sequelize = require("sequelize");
const db = require("../database");
const Service = require("./Service");
const Show = db.define("show", {
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
  tvDbId: {
    type: Sequelize.STRING,
    field: "tv_db_id"
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
  },
  rottenTomatoesId: {
    type: Sequelize.INTEGER,
    field: "rotten_tomatoes_id"
  },
  firstAiredAt: {
    type: Sequelize.STRING,
    field: "first_aired_at"
  },
  theMovieDbId: {
    type: Sequelize.INTEGER,
    field: "the_movie_db_id"
  }
});

module.exports = Show;
