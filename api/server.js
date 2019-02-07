const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const session = require("koa-session");
const passport = require("koa-passport");
const movieRouter = require("./routes/movies");
const authRouter = require('./routes/auth')

const config = require("./config");
const port = process.env.PORT || 3000;
const app = new Koa();

app.keys = [config.secret];

app.use(bodyParser());
app.use(movieRouter.routes());
app.use(authRouter.routes())

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});