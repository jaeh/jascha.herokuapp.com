#!/usr/bin/env node
'use strict';

var path = require('path')
  , fs      = require('fs')
  , program = require('commander')
  , cli     = require(path.join(__dirname,'lib') )
;

function exec() {
    
  program.version('0.0.1');

  if ( process.argv.length <= 2 ) {
    cli.promptForAction();
  }

  program
    .command('*')
    .description('display help text')
    .action(printHelp)
  ;

  program.parse(process.argv);

  function printHelp() {
    console.log('help text');
  }
}
module.exports = exec;
