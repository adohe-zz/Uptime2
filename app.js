/**
 * Monitor remote service
 *
 */
var http = require('http'),
    express = require('express'),
    config = require('config'),
    socketIo = require('socket.io');

var app = express();

// Expose
module.exports = app;
