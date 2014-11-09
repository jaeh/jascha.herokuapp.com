'use strict';

var exec = require('child_process').exec;

function XC (opts) {
  var self = this;
  self.options = opts || {};

  return function xc(cmd, args, cb) {
    if ( ! cb && typeof args === 'function' ) {
      cb = args;
      args = {};
    }
    args = args || {};

    exec(cmd, self.options, function (err, stdout, stderr) {
      args.std = {err: err, stdout: stdout, stderr: stderr};
      execCb(args, cb);
    });
  }
}

function execCb(args, cb) {
  args = args || {};

  if ( typeof cb === 'function') {
    cb(null, args);
  }
}

module.exports = XC;
