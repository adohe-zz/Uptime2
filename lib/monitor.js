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
 * Poll Checks
 */
Monitor.prototype.pollChecksNeedingPoll = function(callback){
  var self = this;
  this.findChecksNeedingPoll(function(err, checks){
    if(err){
      console.error(err);
      if(callback){
        callback(err);
      }
      return;
    }
    checks.forEach(function(check){
      self.pollCheck(check, function(err){
        if(err) console.error(err);
      });
    });
  });
}

Monitor.prototype.findChecksNeedingPoll = function(callback){
  var options = url.parse(this.config.apiUrl + '/checks/needingPoll');
  var self = this;

  http.get(options, function(res){
    if(res.statusCode !== 200){
      return callback(new Error(self.config.apiUrl + '/checks/needingPoll resource responded with error code: ' + res.statusCode));
    }

    var body = '';
    res.on('data', function(chunk){
      body += chunk;
    });
    res.on('end', function(){
      callback(null, JSON.parse(body));
    });
  }).on('error', function(e){
    callback(new Error(self.config.apiUrl + '/checks/needingPoll resource not available: ' + e.message));
  });
}

Monitor.prototype.pollCheck = function(check, callback){
    if(!check) return;

    var Poller, p;
    var now = Date.now();
    var self = this;

    try {
        Poller = this.pollerCollection.getForType(check.type || 'http');
    } catch(unknownTypeError) {

    }

    var pollerCallback = function(err, time, res, pollerDetails){
    };

    try {
        p = new Poller(check.url, this.config.timeout, pollerCallback);
    } catch(incorrectPollerUrl) {
    }

    p.poll();
}

/**
 * Create a monitor to poll all checks at a gievn interval.
 *
 * Example:
 *
 *      m = monitor.createMonitor({ pollingInterval: 60000 });
 *      m.start();
 *      // the polling starts, every 60s
 *      m.stop();
 * 
 * @param {Object} Configuration Object
 * @api public
 */
exports.createMonitor = function(config){
    return new Monitor(config);
}
