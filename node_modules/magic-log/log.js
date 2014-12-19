'use strict';
var color   = require('bash-color')
  , log
;

log = function() {
  if ( log.verbose ) {
    Function.prototype.apply.apply(console.log, [console, arguments]);
  }
}

log.verbose = true;

log.warn = function () {
  arguments[0] = color.yellow(arguments[0]);
  Function.prototype.apply.apply(console.log, [console, arguments]);
}
log.error = function() {
  arguments[0] = color.red(arguments[0]);
  Function.prototype.apply.apply(console.log, [console, arguments]);
}
log.success = function() {
  if ( log.verbose ) {
    arguments[0] = color.green(arguments[0]);
    Function.prototype.apply.apply(console.log, [console, arguments]);
  }
}
log.info = function() {
  if ( log.verbose ) {
    Function.prototype.apply.apply(console.log, [console, arguments]);
  }
}

module.exports = log;
