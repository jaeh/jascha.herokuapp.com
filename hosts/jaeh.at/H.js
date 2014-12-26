'use strict';
var express = require('express')
  , H = express()
;

H.set('blogRoot', '/blog');

module.exports = H;
