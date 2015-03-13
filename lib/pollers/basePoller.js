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
}
