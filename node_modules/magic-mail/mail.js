'use strict';

var nodemailer    = require('nodemailer')
  , path          = require('path')
  , log           = require('magic-log')
  , smtpTransport = require('nodemailer-smtp-transport')
  , mail          = {}
  , cwd           = process.cwd()
  , config        = require( path.join(cwd, 'config') )
;

mail.send = function (email) {
  if ( config.mailTransport && config.mail ) {
    config.mailTransport.to = config.mailTransport.to || config.mail;

    let trans = smtpTransport(config.mailTransport)
      , transport = nodemailer.createTransport(trans)
    ;

    log('email to be sent:', email);
  }

  return email;
}

module.exports = mail;
