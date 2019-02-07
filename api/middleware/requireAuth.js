const jwt = require("jsonwebtoken");
const config = require("../config");
async function requireAuth(ctx, next) {
  const token = ctx.request.headers.authorization;
  if (!token) {
    ctx.status = 401;
    ctx.body = "You must provide a token to access this route";
  }

  try {
    const decoded = jwt.verify(token, config.secret);
    next();
  } catch (e) {
    ctx.status = 401;
    ctx.body = "Invalid token";
  }
}
module.exports = requireAuth;
