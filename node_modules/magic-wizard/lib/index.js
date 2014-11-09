#!/usr/bin/env node
'use strict';

var fs       = require('fs')
  , path     = require('path')
  , inquirer = require('inquirer')
  , async    = require('async')
  , log      = require('magic-log')
  , host     = require( path.join(__dirname, 'host') )
  , cwd      = process.cwd()
  , config   = require(path.join(cwd, 'config') )
  , cli      = {}
;

cli.promptForAction = function promptForAction() {

  async.waterfall([
      cli.chooseHostAction
  ]
  , cli.promptForActionDone
  );
}

cli.chooseHostAction = function () {
  
    var promptArgs = [
      {
          name   : 'action'
        , message: 'Choose an Action'
        , type   : 'list'
        , choices: [
            { name : 'add Host', value: 'add' }
          , { name : 'commit Host', value: 'commit'}
          //, { name : 'save all Hosts', value: 'updateAllHosts' }
          , { name : 'remove Host' , value: 'remove' }
          //, { name : 'commit changes', value: 'commit' }
          , { name : 'commit', value: 'commit' }
          , { name : 'deploy/stage', value: 'deploy' }
        ]
      }
    ];
    
    inquirer.prompt(promptArgs, function(args) {
      if (args.action === 'add') {
        host.add(function (err, results) {

          log('host added.');
          if (err) { log(err, 'error'); }
          log(results);
        });

      } else if ( args.action === 'commit' ) {
        host.commit();
      } else if ( args.action === 'remove' ) {
        host.remove();
      
      } else if ( args.action === 'deploy' ) {
        log(args.action);
        host.deploy(function (err, results) {
          log('deploy done.');
          if (err) { log(err, 'error'); }
          log(results);
        });
      } else {
        log('Wizard Error: Action: ' + args.action + ' not found');
      }
    });
}

cli.host = host;

module.exports = cli;

