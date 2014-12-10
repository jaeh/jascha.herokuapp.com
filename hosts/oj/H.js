'use strict';
var express = require('express')
  , H       = express()
  , router  = express.Router();
;

H.set('404redirect', '/');

H.enable('bodyParser');

router.post('/contact', function (req, res, next) {
  console.log('post to contact');
  console.log('req.body', req.body);
} );

H.set('routes', router);

module.exports = H;
