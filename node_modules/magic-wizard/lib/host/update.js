'use strict';

var async  = require('async')
  , path     = require('path')
  , log    = require('magic-log')
  , prompt = require(path.join(__dirname, '..', 'prompt'))
  , update = {}
;

module.exports = function() {
  async.waterfall(
    [
      prompt.host.choose
    , filterArgs
    , prompt.confirmation
//    , git.update
    ]
    , function (err, results) {
      log('host updated.');
      if (err) { log.error(err); }
    }
  );
}


function filterArgs(args, cb) {
  args.message = 'Update ' + args.hostname + '?';
  cb(null, args);
}
