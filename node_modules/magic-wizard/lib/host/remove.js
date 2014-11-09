'use strict';

var async   = require('async')
  , path    = require('path')
  , log     = require('magic-log')
  , cwd     = process.cwd()
  , rimraf  = require('rimraf')
  , hostDir = path.join(cwd, 'hosts')
  , prompt  = require(path.join(__dirname, '..', 'prompt'))
  , XC      = require('magic-xc')
  , xc      = new XC({cwd: hostDir})
;

module.exports = function (cb) {
  async.waterfall(
    [
        prepare
      , prompt.host.choose
      , filterArgs
      , prompt.confirmation
      , rmHost
      , prepareGitCommit
      , prompt.confirmation
      , gitRm
      , gitCommit
      , prepareGitPush
      , prompt.confirmation
      , gitPush
    ]
    , cb
  );
}

function prepare(cb) {
  cb(null, {});
}

function filterArgs(args, cb) {
  args.confirmMessage = 'Do you really want to delete ' + args.hostname + '?';
  cb(null, args);
}

function rmHost(args, cb) {
  if ( ! args.confirm ) {
    log('rmHost stopped.');
    return cb(null, args);
  }
  log('rmHost ' + args.hostname);

  var hostPath = path.join(hostDir, args.hostname);
  rimraf(hostPath, function (err) {
    cb(err, args);
  });
}
function gitRm(args, cb) {
  if ( ! args.confirm ) {
    log('gitRm stopped.');
    return cb(null, args);
  }
  
  var cmd = 'git rm -r ' + args.hostname;
  log('gitRm command:' + cmd);
  xc(cmd, args, cb);
}

function prepareGitCommit(args, cb) {
  args.confirmMessage = 'Do you also want to commit these changes to git?';
  args.confirmVar = 'confirmCommit';
  cb(null, args);
}

function gitCommit(args, cb) {
  if ( ! args.confirmCommit ) {
    log('Did not commit to git');
    return cb(null, args);
  }
  var cmd = 'git commit -m "wizard removed host ' + args.hostname + '"';
  log('gitCommit command:' + cmd);
  xc(cmd, args, cb);
}

function prepareGitPush(args, cb) {
  args.confirmMessage = 'Do you also want to upload these changes to your online git repository?';
  args.confirmVar = 'confirmPush';
  cb(null, args);
}

function gitPush(args, cb) {
  if ( ! args.confirmPush ) {
    log('Did not push to online git repository');
    return cb(null, args);
  }
  var cmd = 'git push';
  log('gitPush command:' + cmd);
  xc(cmd, args, cb);
}
