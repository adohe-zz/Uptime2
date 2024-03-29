var util = require('util'),
    url = require('url'),
    BasePoller = require('../basePoller');

/**
 * Abstract class for HTTP and HTTPS Pollers, to check web pages or
 * web services.
 *
 * @param {Mixed} Poller Target (e.g. URL)
 * @param {Number} Poller timeout in millseconds. Without response before this duration, the
 * poller stops and executes the error callback.
 * @param {Function} Error/Success callback.
 *
 * @api public
 *
 */
function BaseHttpPoller(target, timeout, callback) {
  BaseHttpPoller.super_.call(this, target, timeout, callback);
}

util.inherits(BaseHttpPoller, BasePoller);

BaseHttpPoller.prototye.initialize = function() {
  if(typeof(this.target) === 'string') {
    this.target = url.parse(this.target);
  }
}

/**
 * Set the User Agent, which identifies the poller to the outside world.
 *
 * @param {String} user agent
 * @api public
 *
 */
BaseHttpPoller.prototype.setUserAgent = function(agent){
  if(typeof this.target.headers === 'undefined'){
    this.target.headers = {};
  }
  this.target.headers['User-Agent'] = agent;
}

/**
 * Response callback.
 *
 * Note that all responses may not be successful, as some return non-200 status codes,
 * and others return to slowly.
 * This methodd handles redirects.
 *
 * @api private
 */
BaseHttpPoller.prototype.onResponseCallback = function(res){
  var statusCode = res.statusCode.toString();
  if(statusCode.match(/3\d{2}/)){
    // Redirect handling
    this.handleRedirectResponse(res); // abstract
  }
  if(statusCode.match(/2\d{2}/) === null){
    this.handleErrorResponse(res);
  }
  this.handleSuccessResponse(res);
}

/**
 * Error Response Callback.
 *
 * This method handles the error response.
 */
BaseHttpPoller.prototype.handleErrorResponse = function(res){
  this.request.abort();
  this.onErrorCallback({ name: 'NotOkStatusCode', message: 'HTTP Status ' + res.statusCode });
}

/**
 * Success Response Callback.
 *
 * This method handles the success response.
 *
 */
BaseHttpPoller.prototype.handleSuccessResponse = function(res){
  var poller = this;
  var body = '';
  this.debug(this.getTime() + 'ms HTTP Status 200 OK');
  res.on('data', function(chunk){
    body += chunk.toString();
  });
  res.on('end', function(){
    res.body = body;
    poller.timer.stop();
    poller.debug(this.getTime() + 'ms Request Finished');
  });
}

/**
 * Timeout Callback
 *
 * @api private
 */
BaseHttpPoller.prototype.timeroutReached = function(){
  BaseHttpPoller.super_.prototype.timeroutReached.call(this);
  this.request.removeAllListeners('error');
  this.request.on('error', function(){});
  this.request.abort();
}

/**
 * Expose
 */
module.exports = BaseHttpPoller;
