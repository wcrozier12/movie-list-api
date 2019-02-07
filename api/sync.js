const axios = require("axios");
const inquirer = require("inquirer");
const GuideBoxClient = require("../services/guidebox");
const Service = require("./models/Service");
const Show = require("./models/Show.js");
const Movie = require("./models/Movie");
const ShowsServices = require("./models/ShowsServices");
const MoviesServices = require("./models/MoviesServices");
const initialQuestion = [{
  type: "list",
  name: "initial",
  message: "What would you like to do?",
  choices: ["Sync services", "Sync shows", "Sync movies"]
}];

const gbClient = new GuideBoxClient({
  endpoint: "http://api-public.guidebox.com/v2",
  apiKey: "52eda3ee013c81f47a38a9239c3ee9cd5494a88c"
});

async function syncServices() {
  const services = await gbClient.getServices();

  const promises = services.map(async service => {
    delete service.id;
    const serviceExists = !!await Service.findOne({
      where: {
        display_name: service.display_name
      }
    });
    if (serviceExists) {
      return;
    }
    return Service.create(service);
  });

  await Promise.all(promises)
    .then(response => {
      return console.log("All services up to date");
    })
    .catch(e => {
      console.log("There was an error syncing services");
      process.exit(1);
    });
}

async function saveShowsForService(shows, service, offset) {
  console.log("INSIDE SAVE SHOWS FOR SERVICE");
  const serviceId = (await Service.findOne({
    where: {
      source: service
    }
  })).id;

  const promises = [];
  for (const show of shows) {
    delete show.id;
    const showInDb = await Show.findOne({
      where: {
        title: show.title
      }
    });

    if (!showInDb) {
      const showData = {
        title: show.title,
        imgSmall: show.artwork_208x117,
        imgMedium: show.artwork_304x171,
        imgLarge: show.artwork_448x252,
        imgExtraLarge: show.artwork_608x342,
        imdbId: show.imdb_id,
        tvDbId: show.tvdb,
        theMovieDbId: show.themoviedb,
        wikipediaId: show.wikipedia_id,
        firstAiredAt: show.first_aired
      };

      const newShow = await Show.create(showData);
      promises.push(
        ShowsServices.create({
          showId: newShow.get("id"),
          serviceId,
          servicePopularity: shows.indexOf(show) + 1 + offset
        })
      );
    } else if (!!showInDb) {
      const associatedToService = await ShowsServices.findAll({
        where: {
          showId: showInDb.id,
          serviceId
        }
      });
      if (associatedToService.length === 0) {
        promises.push(
          ShowsServices.create({
            showId: showInDb.id,
            serviceId,
            servicePopularity: shows.indexOf(show) + 1 + offset
          })
        );
      }
    }

    //TODO query 250 and handle all multiple requests when more than 250 shows
  }
  await Promise.all(promises)
    .then(response => {
      console.log(`Shows successfully synced for ${service}`);
      return true;
    })
    .catch(e => {
      console.log("error is", e);
      console.log(`Error syncing shows for ${service}`);
    });
}

async function syncShows() {
  try {
    const allServices = (await Service.findAll({
      order: [
        ["source", "ASC"]
      ]
    })).map(service => service.source);

    const {
      services
    } = await inquirer.prompt([{
      type: "checkbox",
      name: "services",
      message: "Which services would you like to sync?",
      choices: allServices
    }]);

    for (const service of services) {
      let trips = 0;
      let offset = 0;
      while (trips < 6) {
        console.log("TRIP IS", trips);
        console.log("OFFSET IS", offset);
        const {
          total_results,
          results,
          total_returned
        } = await gbClient.getShowsByService(service, 250, offset);
        console.log("TOTAL_RESULTS FROM GB", total_results);
        console.log("TOTAL_RETURNED FROM GB", 250);
        if (total_results === 0) {
          console.log(`No shows found for ${service}`);
          trips = 6;
        } else {
          await saveShowsForService(results, service, offset);
          trips++;
          offset += total_returned;
        }
      }
    }
  } catch (e) {
    console.log("error is", e);
    console.log("There was an error syncing your shows");
    return;
  }
}

async function saveMoviesForService(movies, service, offset) {
  const serviceId = (await Service.findOne({
    where: {
      source: service
    }
  })).id;

  const promises = [];
  for (const movie of movies) {
    delete movie.id;
    const movieInDb = await Movie.findOne({
      where: {
        title: movie.title
      }
    });

    if (!movieInDb) {
      const movieData = {
        title: movie.title,
        imgSmall: movie.poster_120x171,
        imgMedium: movie.poster_240x342,
        imgLarge: movie.poster_400x570,
        imdbId: movie.imdb,
        rottenTomatoesId: movie.rottentomatoes,
        rating: movie.rating,
        theMovieDbId: movie.themoviedb,
        wikipediaId: movie.wikipedia_id,
        releaseDate: movie.release_date
      };

      const newMovie = await Movie.create(movieData);
      promises.push(
        MoviesServices.create({
          movieId: newMovie.get("id"),
          serviceId,
          servicePopularity: movies.indexOf(movie) + 1 + offset
        })
      );
    } else if (!!movieInDb) {
      const associatedToService = await MoviesServices.findAll({
        where: {
          movieId: movieInDb.id,
          serviceId
        }
      });
      if (associatedToService.length === 0) {
        promises.push(
          MoviesServices.create({
            movieId: movieInDb.id,
            serviceId,
            servicePopularity: movies.indexOf(movie) + 1 + offset
          })
        );
      }
    }
  }
  await Promise.all(promises)
    .then(response => {
      console.log(`Movies successfully synced for ${service}`);
      return true;
    })
    .catch(e => {
      console.log("error is", e);
      console.log(`Error syncing Movies for ${service}`);
    });
}

async function syncMovies() {
  try {
    const allServices = (await Service.findAll({
      order: [
        ["source", "ASC"]
      ]
    })).map(service => service.source);

    const {
      services
    } = await inquirer.prompt([{
      type: "checkbox",
      name: "services",
      message: "Which services would you like to sync?",
      choices: allServices
    }]);

    for (const service of services) {
      let trips = 0;
      let offset = 0;
      while (trips < 6) {
        console.log("TRIP IS", trips);
        console.log("OFFSET IS", offset);
        const {
          total_results,
          results,
          total_returned
        } = await gbClient.getMoviesByService(service, 250, offset);
        console.log("TOTAL_RESULTS FROM GB", total_results);
        if (total_results === 0) {
          console.log(`No movies found for ${service}`);
          trips = 6;
        } else {
          await saveMoviesForService(results, service, offset);
          trips++;
          offset += total_returned;
        }
      }
    }
  } catch (e) {
    console.log("error is", e);
    console.log("There was an error syncing your movies");
    return;
  }
}
async function run() {
  const {
    initial
  } = await inquirer.prompt(initialQuestion);
  switch (initial) {
    case "Sync services":
      await syncServices();
      break;
    case "Sync shows":
      await syncShows();
      break;
    case "Sync movies":
      await syncMovies();
      break;
    default:
      console.log("You must select an option");
      break;
  }
  process.exit();
}

run();