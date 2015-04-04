/**
 * Module Dependencies
 */
var express = require('express');

var app = express();

if(!module.parent){
   app.listen(8080);
}
