var timer = require('../timer');

/**
 * Base Poller constructor
 *
 * @param {Mixed} Poller Target (e.g. URL)
 * @param {Number} Poller timeout in milliseconds. The request timeout
 * @param {Function} Error/Success callback
 * @api public
 *
 */
function BasePoller(target, timeout, callback) {
    this.target = target;
    this.timeout = timeout || 5000;
    this.callback = callback;
    this.isDebugEnabled = false;
    this.initialize();
}

/**
 * Initializer method
 * Override this method in child process to prepare the target property.
 * @api public
 *
 */
BasePoller.prototype.initialize = function() {}

/**
 * Enable or disable the debug console output
 *
 * @param {Boolean} debug
 * @api public
 */
BasePoller.prototype.setDebug = function(bool) {
  this.isDebugEnabled = bool;
}

/**
 * Log debug message to console output if debug is enabled.
 *
 * @api private
 */
BasePoller.prototype.debug = function(msg) {
  if(this.isDebugEnabled) console.log(msg);
}

/**
 * Launch the actual polling
 *
 * @api public
 */
BasePoller.prototype.poll = function() {
    if(!this.timer) {
        this.timer = timer.createTimer(this.timeout, this.timeoutReached.bind(this));
    }
    this.debug(this.getTime() + 'ms Emitting Request');
}

/**
 * Error callback
 *
 * @api private
 */
BasePoller.prototype.onErrorCallback = function(err) {
  this.timer.stop();
  this.debug(this.getTime() + 'ms Got err: ' + err.message);
  this.callback(err, this.getTime());
}

/**
 * Timeout Callback
 *
 * @api private
 */
BasePoller.prototype.timeoutReached = function() {
    this.onErrorCallback({ name: 'TimeoutError', message: 'Request Timeout' });
}

/**
 * Proxy to the timer's getTime
 *
 * @api private
 */
BasePoller.prototype.getTime = function() {
  return this.timer.getTime();
}

/**
 * Validate poller target url (static method)
 *
 * Override this method in child process to prepare the target property.
 *
 * @api public
 */
BasePoller.validateTarget = function(target) {
    return false;
}

/**
 * Expose
 */
module.exports = BasePoller;
