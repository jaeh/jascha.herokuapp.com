'use strict';

var inquirer = require('inquirer')
  , log      = require('magic-log')
  , path     = require('path')
  , cwd      = process.cwd()
  , prompt   = {}
;

prompt.confirmation = function (args, cb) {
  var name = args.var || 'confirm';

  inquirer.prompt( {
      name: name
    , type: 'confirm'
    , message: args.message || 'Confirm: '
    , default: false
  }, function (input) {
    args[name] = ( input[name] === true );
    cb(null, args);
  });
}

prompt.input = function (args, cb) {
  var name = args.var || 'confirm';

  inquirer.prompt( {
      name: name
    , type: 'text'
    , message: args.message || 'Input: '
    , default: args.default || false
  }, function (input) {
    if ( ! input || ! input[name] ) { return cb('Need an input', args); }
    args[name] = ( input[name] );
    cb(null, args);
  });
}

prompt.choice = function (args, cb) {
  var name = args.var || 'choice';

  if ( ! args.choices ) {
    return cb('Need choices for choice prompt');
  }

  inquirer.prompt( {
      name: name
    , type: 'list'
    , message: args.message || 'Choose: '
    , choices: args.choices
    , default: args.default || null
  }, function (input) {
    args[name] = input[name];
    cb(null, args);
  });
}

module.exports = prompt;
