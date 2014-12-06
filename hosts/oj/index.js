'use strict';

var express = require('express')
  , path    = require('path')
  , favicon = require('serve-favicon')
  , stylus  = require('stylus')

  , pub     = path.join(__dirname, 'public')
  , lib     = path.join(__dirname, 'lib')
  , views   = path.join(__dirname, 'views')

  , router  =  require( path.join(process.cwd(), 'lib', 'router') )

  , app = express();

// view engine setup
app.set('views', views);
app.set('view engine', 'jade');

app.use( favicon( path.join(pub, 'favicon.ico') ) );

app.use( stylus.middleware(pub) );

app.use( express.static(pub) );

app.use( router );

module.exports = app;
