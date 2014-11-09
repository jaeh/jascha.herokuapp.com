'use strict';
var path = require('path');

module.exports = {
  defaults: {
    development: {
      host: "http://jaeh:5000"
    , PORT: 5000
    , db: {
        driver: 'tingodb'
      , database: path.join(__dirname, 'db')
      }
    }
  , production: {
      host: "https://jaeh.at"
    , PORT: 5000
    , db: {
        driver: 'tingodb'
      , database: path.join(__dirname, 'db')
      }
    }
  , staging: {
      host: "https://staging.jaeh.at"
    , PORT: 5000
    , db: {
        driver: 'tingodb'
      , database: path.join(__dirname, 'db')
      }
    }
  }
, heroku: {
    remote: "jascha"
  , staging: "jascha-staging"
  }
}
