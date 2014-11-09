'use strict';
var path    = require('path')
  , caminte = require('caminte')
  , Schema  = caminte.Schema
  , schema  = false
  , log     = require('magic-log')
;

exports.init = function init (settings) {
  if ( schema ) { return schema; }

  if ( ! settings || typeof settings !== 'object' || ! settings.driver) {
    settings = {
      driver: 'tingodb'
    , database: path.join(process.cwd(), 'gs.db')
    };
    log('magic-db init called without a valid settings object. defaults used.');
    log(settings);
  }

  schema = new Schema(settings.driver, settings);
  return schema;
}
