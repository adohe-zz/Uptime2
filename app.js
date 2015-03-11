/**
 * Monitor remote service
 *
 */
var http = require('http'),
    express = require('express'),
    mongoose = require('mongoose'),
    config = require('config');

var app = express(),
    server = http.createServer(app);

var connect = function() {

}
// Expose
module.exports = app;
