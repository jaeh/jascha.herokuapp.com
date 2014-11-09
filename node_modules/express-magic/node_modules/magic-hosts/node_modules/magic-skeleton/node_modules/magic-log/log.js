'use strict';

var color = require('bash-color')
  , verbose = true
;

module.exports = function(str, type) {
  if (str) {
    if ( type === 'error') {
      str = color.red(str);
    } else if ( type === 'success' ) {
      str = color.green(str);
    } else if ( type === 'warning' ) {
      str = color.yellow(str);
    }

    console.log(str);
  }
}
