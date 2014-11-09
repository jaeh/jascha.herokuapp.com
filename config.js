'use strict';

module.exports = {
  defaults: {
      development: {
        host: "http://jaeh.test:5000"
      , PORT: 5000
      }
    , production: {
        host: "https://jaeh.at"
      , PORT: 5000
      }
    , staging: {
        host: "https://staging.jaeh.at"
      , PORT: 5000
    }
  }
, heroku: {
      remote: "jascha"
    , staging: "jascha-staging"
  }
}
