'use strict';

module.exports = {
  defaults: {
      development: {
        host: "http://jaeh:5000"
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
  , mail: 'jascha@jaeh.at'
  , mailTransport: {
      host: 'localhost'
    , port: 465
    , secure: true
    , auth: {
        user: 'username'
      , pass: 'password'
    }
  }
}
