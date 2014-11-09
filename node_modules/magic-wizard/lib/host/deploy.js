'use strict';

var heroku = require('magic-heroku');

function deploy(cb) {
  //this will be the place to hook in other deploy possibilities,
  //nodejitsu comes to mind.
  heroku.deploy(cb);
}

module.exports = deploy;
