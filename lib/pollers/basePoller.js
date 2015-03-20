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
 * Launch the actual polling
 *
 * @api public
 */
BasePoller.prototype.poll = function() {
    if(!this.timer) {
        this.timer = timer.createTimer(this.timeout, this.timeoutReached.bind(this));
    }
}

/**
 * Error callback
 *
 * @api private
 */
BasePoller.prototype.onErrorCallback = function(err) {
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
 * Validate poller target url (static method)
 *
 * Override this method in child process to prepare the target property.
 *
 * @api public
 */
BasePoller.validateTarget = function(target) {
    return false;
}
