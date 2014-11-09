'use strict';
var log = require('magic-log');

module.exports = function(app, req, res ,next) {
  var useMenu = app.get('useMenu')
    , schema  = app.get('schema')
    , define  = schema.define
  ;
  
  if ( ! useMenu || ! schema || ! typeof schema.define !== 'function' ) {
    if ( typeof next === 'function') { next(); }
    return;
  } else {
    //schema is a reference to a global object, 
    //calling define pushes into app.get('schema').models
    //using caminte
    let Menu = define('Menu', {
          name:   { type: String, length: 23 }
        , htmlId: { type: String, length: 23 }
        })
      , MenuItem = define('MenuItem', {
        text:   { type: String, lenght: 23 } //text of the menu item
      , htmlId: { type: String, length: 23 } //html li wrapper id
      , href:   { type: String } //html a href attribute
      , target: { type: String, length: 23 } //html a _target=''
      })
    ;

    Menu.hasMany(MenuItem, {as: 'items',  foreignKey: 'itemId'});

    if ( typeof next === 'function') { next(); }
  }
}
