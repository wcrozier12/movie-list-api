const Sequelize = require("sequelize");
const db = require("../database");

const User = db.define("user", {
  firstName: {
    type: Sequelize.STRING,
    field: "first_name"
  },
  lastName: {
    type: Sequelize.STRING,
    field: "last_name"
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
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

module.exports = User;
