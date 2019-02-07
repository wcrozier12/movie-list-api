const Router = require("koa-router");
const db = require('../database')
const router = new Router();
const Movie = require("../models/Movie");
router
  .get("/popularMovies", async (ctx, next) => {
    const movies = await db.query('select * from (select distinct on (movies.title) * from movies left join movies_services on movies_services.movie_id = movies.id order by movies.title, movies_services.service_popularity asc) t order by t.service_popularity limit 200');
    ctx.body = {
      movies
    }
  });

module.exports = router;