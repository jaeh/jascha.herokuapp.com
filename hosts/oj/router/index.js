'use strict';

var express = require('express')
  , router  = express.Router()
  , path    = require('path')
  , mail    = require('magic-mail')
  , log     = require('magic-log')
  , cwd     = process.cwd()
  , config  = require( path.join(cwd, 'config') )
;

router.post('/contact', function (req, res, next) {
  var locals = locals || {};
  locals.errors = locals.errors || {};

  if ( !req.body ) {
    log.error('Please enable the bodyparser in your host: H.enable(\'bodyparser\');');
  }

  var email = {
        msg    : req.body.msg
      , from   : req.body.from
      , to     : config.mail
      , subject: 'Mail through the contact form of your homepage'
    }
  ;

  locals.from = email.from;
  locals.msg  = email.msg;
  locals.errors.from = ! locals.from;
  locals.errors.msg  = ! locals.msg;

  //nodemailer mail
  mail.send(email);

  res.render('pages/contact', locals);
} );


module.exports = router;
