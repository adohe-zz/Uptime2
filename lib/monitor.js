var http = require('http'),
    url = require('url'),
    EventEmitter = require('events').EventEmitter,
    PollerCollection = require('./pollers/pollerCollection');

/**
 * Monitor constructor
 *
 * The monitor pings the checks regularly and saves the response status and time.
 * The monitor doesn't interact with the model classes directly, but instead uses
 * the REST HTTP API. This way the monitor can run on a separate process, so that
 * the ping measurments don't get distorted by a heavy usage of the GUI.
 *
 * The constructor expects a configuration object as parameter, with these properties:
 *    pollingInterval: Interval between each poll in milliseconds, defaults to 10 seconds
 *    timeout: Request timeout in millseconds, defaults to 5 seconds
 *
 * @param {Object} Monitor configuration
 * @api public
 */
function Monitor(config) {
  config.pollingInterval = config.pollingInterval || 10 * 1000;
  config.timeout = config.timeout || 5 * 1000;
  this.config = config;
  this.pollerCollection = new PollerCollection();
}

/**
 * Inherit from the EventEmitter
 */
Monitor.prototype.__proto__ = EventEmitter.prototype;

/**
 * Start the monitoring of all checks
 *
 */
Monitor.prototype.start = function(){
    // start polling right away
    this.pollChecksNeedingPoll();
    this.intervalForPoll = setInterval(this.pollChecksNeedingPoll.bind(this), this.config.pollingInterval);
}

/**
 * Stop the monitoring of all checks
 */
Monitor.prototype.stop = function(){
    clearInterval(this.intervalForPoll);
}

/**
 *
 *
 */
Monitor.prototype.pollChecksNeedingPoll = function(callback){
}
