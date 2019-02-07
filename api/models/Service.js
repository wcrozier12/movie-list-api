const Sequelize = require("sequelize");
const db = require("../database");

const Service = db.define("service", {
  display_name: {
    type: Sequelize.STRING
  },
  source: {
    type: Sequelize.STRING
  },
  type: {
    type: Sequelize.STRING
  },
  ios_app: {
    type: Sequelize.STRING
  },
  android_app: {
    type: Sequelize.STRING
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

module.exports = Service;
