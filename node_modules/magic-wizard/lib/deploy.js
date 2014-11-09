'use strict';

var fs     = require('fs')
  , exec   = require('child_process').exec
  , log    = require('magic-log')
  , async  = require('async')
  , xc     = require('magic-xc')
  , heroku = require('magic-heroku')
;

function deploy(cb) {
  
  //this will be the place to hook in other deploy possibilities,
  //nodejitsu comes to mind.
  heroku.deploy(cb);
}

module.exports = deploy;
