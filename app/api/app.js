/**
 * Module Dependencies
 */
var express = require('express');

var app = module.exports = express();

if(!module.parent) {
  app.listen(8080);
}
