'use strict';

var async   = require('async')
  , path    = require('path')
  , log     = require('magic-log')
  , prompt  = require(path.join(__dirname, '..', 'prompt') )
  , hostDir = path.join(process.cwd(), 'hosts')
  , XC      = require('magic-xc')
  , xc      = new XC({cwd: hostDir})
  
  , git     = {}
;

module.exports = function(cb) {
  async.waterfall( 
    [
      prepare
    , prompt.host.choose
    , git.add
    , git.commit
    , prepareConfirm
    , prompt.confirmation
    , git.push
    ]
    , cb
  );
}

function prepare(cb) {
  cb(null, {});
}

function prepareConfirm(args, cb) {
  args.confirmMessage = 'Do you also want to push this changes to your online git repository?';
  cb(null, args);
}

git.add = function(args, cb) {
  var cmd = 'git add ' + args.hostname;
  xc(cmd, args, cb);
}
git.commit = function(args, cb) {
  var cmd = 'git commit -m "wizard updated host ' + args.hostname + '"';
  xc(cmd, args, cb);
}

git.push = function(args, cb) {
  if (args.confirm) {
    var cmd = 'git push';
    xc(cmd, args, cb);
  }
}
