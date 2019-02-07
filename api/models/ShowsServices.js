const Sequelize = require("sequelize");
const db = require("../database");
const Service = require("./Service");
const ShowsServices = db.define(
  "shows_services",
  {
    showId: {
      type: Sequelize.STRING,
      primaryKey: true,
      field: "show_id"
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

module.exports = ShowsServices;
