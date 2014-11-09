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
    , prompt.host.name
    , prompt.git.provider
    , prompt.git.url
    , prompt.git.user
    , prompt.git.repository
    , prepareGit
    , git.clone
    , rmGitDir
    , prepareGitCommitPrompt
    , prompt.confirmation
    , git.add
    , git.commit
    , prepareGitPushPrompt
    , prompt.confirmation
    , git.push
    ]
    , cb
  );
}

function prepare(cb) {
  cb(null, {});
}

function prepareGit(args, cb) {
  var host = args.hostname
    , prov = args.gitProvider
    , user = args.gitUser
    , repo = args.gitRepository
    , url  = args.gitUrl || prov + user + '/' + repo
  ;
  
  cb(null, {hostname: host, url: url});
}


git.clone = function(args, cb) {
  var cmd = 'git clone ' + args.url + ' ' + args.hostname;
  xc(cmd, args, cb);
}

function rmGitDir(args, cb) {
  var cmd = 'rm ' + args.hostname + '/.git -rf';
  xc(cmd, args, cb);
}

git.add = function (args, cb) {
  if ( ! args.confirmCommit) {
    return cb(null, args);
  }
  var cmd = 'git add ' + args.hostname;
  log('git add cmd: ' + cmd);
  xc(cmd, args, cb);
}

function prepareGitCommitPrompt(args, cb) {
  args.message = 'Do you want to commit this host to git?';
  args.var = 'confirmCommit';
  cb(null, args);
}

git.commit = function (args, cb) {
  if ( ! args.confirmCommit ) {
    log('git commit stopped by user');
    return cb(null, args);
  }
  var cmd = 'git commit -m "Wizard added host: ' + args.hostname + '"';
  console.log('git commit cmd: ' + cmd);
  xc(cmd, args, cb);
}

function prepareGitPushPrompt(args, cb) {
  args.message = 'Do you want to push this host to your online git repository?';
  args.var = 'confirmPush';
  cb(null, args);
}

git.push = function (args, cb) {
  if ( ! args.confirmPush ) {
    log('git push stopped by user');
    return cb(null, args);
  }
  log('git push started')
  var cmd = 'git push';
  xc(cmd, args, cb);
}

function gitCb(err, args) {
  var std = args.std;

  if (err) { log('error = ' + err, 'error'); }
    
  if (std.stderr) {
    if ( std.stderr.indexOf('Cloning into') === 0 ) {
      log(std.stderr, 'success');
    } else {
      log(std.stderr, 'error')
    }
  }
  if (std.stdout) { log(std.stdout); }

  cb(err, args);
}
