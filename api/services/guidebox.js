const axios = require("axios");

class GuideBoxClient {
  constructor(options) {
    if (!options.endpoint || !options.apiKey) {
      return "You must provide an endpoint and apiKey";
    }
    this.endpoint = options.endpoint;
    this.apiKey = options.apiKey;
  }

  async getServices() {
    try {
      const { data } = await axios.get(`${this.endpoint}/sources`, {
        headers: { Authorization: this.apiKey }
      });
      return data.results;
    } catch (e) {
      const { message } = e;
      return message;
    }
  }

  async getShowsByService(service, limit, offset) {
    if (!service) {
      return "You must provide a service";
    }

    try {
      const { data } = await axios.get(
        `${this.endpoint}/shows/?sources=${service}&limit=${limit ||
          250}&offset=${offset || 0}`,
        {
          headers: { Authorization: this.apiKey }
        }
      );

      return data;
    } catch (e) {
      const { message } = e;
      return message;
    }
  }

  async getMoviesByService(service, limit, offset) {
    if (!service) {
      return "You must provide a service";
    }
    try {
      const { data } = await axios.get(
        `${this.endpoint}/movies/?sources=${service}&limit=${limit ||
          250}&offset=${offset || 0}`,
        {
          headers: { Authorization: this.apiKey }
        }
      );

      return data;
    } catch (e) {
      const { message } = e;
      return message;
    }
  }
}

module.exports = GuideBoxClient;
