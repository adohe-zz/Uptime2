/**
 * Monitor remote service
 *
 */
var http = require('http'),
    url = require('url')
    express = require('express'),
    config = require('config');

var mongoose = require('./bootstrap');

var app = express(),
    server = http.createServer(app);

// Bootstrap application settings
require('./config/express')(app, config);

// Bootstrap socket.io settings
require('./config/io')(server, config);

if(!module.parent) {
  var serverUrl = url.parse(config.url);
  var port = serverUrl.port;
  if(port === null) {
    port = 80;
  }

  var host = serverUrl.hostname;
  server.listen(port, function() {
    console.log('Express server listening on host %s, port %d', host, port);
  });
  server.on('error', function() {
  });
}

// Expose
module.exports = app;
