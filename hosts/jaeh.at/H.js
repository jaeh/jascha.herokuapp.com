'use strict';
var express = require('express')
  , H = express()
;
H.set('404redirect', '/');
module.exports = H;
