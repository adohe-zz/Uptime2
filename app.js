/**
 * Monitor remote service
 *
 */
var http = require('http'),
    url = require('url')
    express = require('express'),
    config = require('config'),
    monitor = require('./lib/monitor');

var mongoose = require('./bootstrap');

var app = express(),
    server = http.createServer(app);

// Bootstrap application settings
require('./config/express')(app, config);

// Bootstrap socket.io settings
require('./config/io')(server, config);

// Expose
module.exports = app;

var monitorInstance;

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
      if(monitorInstance) {
          monitorInstance.stop();
          process.exit(1);
      }
  });
}

if(config.autoStartMonitor){
    monitorInstance = require('./monitor');
}
