/**
 * Module Dependencies
 */
var express = require('express');

var app = module.exports = express();

// Bootstrap application settings
require('./config/express')(app);

// Bootstrap routes
require('./routes/routes')(app);

if(!module.parent){
   app.listen(3000);
   console.log('dashboard app listen on port 3000');
}
