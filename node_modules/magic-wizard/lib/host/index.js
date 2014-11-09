'use strict';

var path     = require('path')
  , host     = {
      add   : require( path.join(__dirname, 'add') )
    , update: require( path.join(__dirname, 'update') )
    , remove: require( path.join(__dirname, 'remove') )
    , deploy: require( path.join(__dirname, 'deploy') )
    , commit: require( path.join(__dirname, 'commit') )
  }
;


module.exports = host;
