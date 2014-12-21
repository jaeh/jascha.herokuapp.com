'use strict';

var express = require('express')
  , fs      = require('fs')
  , jade    = require('jade')
  , router  = express.Router()
  , path    = require('path')
  , mail    = require('magic-mail')
  , log     = require('magic-log')
  , cwd     = process.cwd()
  , config  = require( path.join(cwd, 'config') )
;
/*
router.get('*', function (req, res, next) {
  if ( ! req.query || ! req.query.js ) {
    return next();
  }
  
  log('req.query', req.query);
  if ( req.query.js ) {
    var fileName = (req.path.replace('/', '') || 'index') + '.jade';
    log('fileName', fileName);
    fs.readFile(path.join(__dirname, '..', 'views', 'pages', fileName), function (err, content) {
      if ( err ) {
        log(err);
      }
      content = content.toString();
      if ( content.indexOf('block content') >= 0 ) {
        content = content.split('block content')[1];
        log('fs.readFile', err, content.toString());
        content = jade.compile(content);
        res.send(content);
      }
    } );

    //next();
  }
} );*/

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
