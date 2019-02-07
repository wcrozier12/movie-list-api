const Router = require("koa-router");
const router = new Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwtForUser = require("../lib/jwtTokenForUser");
const requireAuth = require("../middleware/requireAuth");
const Movie = require("../models/Movie");
const Service = require("../models/Service");
const axios = require("axios");
router
  .post("/signup", async (ctx, next) => {
    const {
      email,
      password
    } = ctx.request.body;
    const movie = await Movie.create({});
    const user = await User.findOne({
      where: {
        email
      }
    });
    if (user) {
      return (ctx.body = {
        message: "A user with that email address already exists"
      });
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await User.create({
      email,
      password: passwordHash
    });

    ctx.body = {
      message: "Successful!"
    };
  })
  .post("/signin", async (ctx, next) => {
    const {
      email,
      password
    } = ctx.request.body;
    const user = await User.findOne({
      where: {
        email
      }
    });

    if (!user) {
      return (ctx.body = {
        message: "No username associated with that email address"
      });
    }
    const token = jwtForUser(user);
    ctx.body = {
      authenticated: true,
      token
    };
  })
  .get("/", requireAuth, async (ctx, next) => {
    const movie = await Movie.findOne({});
    console.log(movie);
    ctx.body = {
      status: "ok",
      message: "Hello world"
    };
  })
  .get("/sync/movies/:serviceName", async (ctx, next) => {
    const {
      serviceName
    } = ctx.params;

    const serviceId = (await Service.findOne({
      where: {
        name: serviceName
      }
    })).id;
    const {
      data
    } = await axios.get(
      `http://api-public.guidebox.com/v2/shows?limit=250&sources=${serviceName}`, {
        headers: {
          Authorization: "52eda3ee013c81f47a38a9239c3ee9cd5494a88c"
        }
      }
    );

    const {
      total_results
    } = data;

    const {
      results
    } = data;

    const promises = [];

    for (let i = 0; i < results.length; i++) {
      promises.push(
        Movie.create({
          title: results[i].title,
          imgSmall: results[i].artwork_208x117,
          imgMedium: results[i].artwork_304x171,
          imgLarge: results[i].artwork_448x252,
          imgExtraLarge: results[i].artwork_608x342,
          imdbId: results[i].imdb_id,
          tvDbId: results[i].tvdb,
          wikipediaId: results[i].wikipedia_id,
          serviceId
        })
      );
    }

    await Promise.all(promises)
      .then(res => {
        ctx.body = `Successfully synced movies for ${serviceName}`;
      })
      .catch(e => {
        ctx.body = e.message;
      });
  });

module.exports = router;