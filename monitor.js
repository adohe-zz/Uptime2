var fs = require('fs'),
    config = require('config'),
    Monitor = require('./lib/monitor');

// start the monitor
var monitor = Monitor.createMonitor(config.monitor);

monitor.start();

/*
*Expose
*/
module.export = monitor;
