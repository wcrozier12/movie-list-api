const jwt = require("jsonwebtoken");
const config = require("../config");

function jwtForUser(user) {
  try {
    const token = jwt.sign({ userId: user.id }, config.secret);
    return token;
  } catch (e) {
    return e;
  }
}

module.exports = jwtForUser;
