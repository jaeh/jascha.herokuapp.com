'use strict';

var path   = require('path')
  , async  = require('async')
  , cwd    = process.cwd()
  , heroku = require('magic-heroku')
  , prompt = require(path.join(__dirname, '..', 'prompt') )
  , log    = require('magic-log')
  , XC     = require('magic-xc')
  , xc     = new XC({cwd: path.join(cwd, 'hosts')})
;

function stage(cb) {
  //this will be the place to hook in other deploy possibilities,
  //nodejitsu comes to mind.
  
  async.waterfall([
      prepare
    , findRemotes
    , prepareChooseRemotes
    , prompt.choice
    , prepareRemotePrompt
    , addRemote
    , pushRemote
  ]
  , cb
  );
}

function prepare(cb) {
  cb(null, {});
}

function prepareChooseRemotes(args, cb) {
  args.choices = args.remotes;
  args.message = 'Which remote do you want to use for staging?';
  args.var     = 'remote'

  cb(null, args);
}

function prepareRemotePrompt(args, cb) {

  if ( args.remote && args.remote !== 'none') { return cb(null, args); }

  args.testfor = 'none';
  args.var = 'newRemote';
  args.message = 'Name the new remote (production or staging preferred)'

  prompt.input(args, cb);
}

function addRemote(args, cb) {
  if ( args.remote && args.remote !== 'none' ) { return cb(null, args); }

  if ( ! args.newRemote ) {
    return cb('addRemote needs a remote name');
  }

  log('args.remote in addRemote = ' + args.newRemote);

  var cmd = 'git remote add ' + args.newRemote;
  log('addRemote called with cmd: ' + cmd);
  args.remote = args.newRemote;
  xc(cmd, args, cb);
}

function pushRemote(args, cb) {
  if ( ! args.remote ) { return cb('Remote not defined in pushRemote'); }
  var cmd = 'git push ' + args.remote + ' master';
  log('pushRemote called with cmd: ' + cmd);
  xc(cmd, args, cb);
}


function findRemotes(args, cb) {
  var cmd = 'git remote -v';

  xc(cmd, function (err, results) {
    var lines = results.std.stdout.split('\n')
      , remotes = []
    ;

    for(var k in lines) {
      if ( lines.hasOwnProperty(k) ) {
        var line = lines[k];

        if( line.indexOf('(fetch)') >= 0 ) {
          var lineArray = line.split('\t')
            , remote = {
                name: lineArray[0]
              , url: lineArray[1]
            }
          ;
          if ( remote.name !== 'origin' ) {
            remotes.push(remote);
          }
        }
      }
    }
    args.remotes = remotes;

    cb(null, args);
  });
}


module.exports = stage;
