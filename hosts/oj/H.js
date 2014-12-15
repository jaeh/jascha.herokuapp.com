'use strict';
var express = require('express')
  , H       = express()
  , router  = require('./router');
;

H.set('404redirect', '/');

H.enable('bodyParser');

H.set('routes', router);

module.exports = H;
