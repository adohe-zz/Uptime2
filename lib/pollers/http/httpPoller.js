var util = require('util'),
    url = require('url'),
    http = require('http'),
    BaseHttpPoller = require('./baseHttpPoller');

/**
 * HTTP Poller, to check the web pages or services.
 *
 * @param {Mixed} Poller Target (e.g. URL)
 * @param {Number} Poller timeout in millseconds.
 * @param {Function} Error/Success callback
 * @api public
 */
function HttpPoller(target, timeout, callback) {
  HttpPoller.super_.call(this, target, timeout, callback);
}

util.inherits(HttpPoller, BaseHttpPoller);

HttpPoller.type = 'http';

HttpPoller.validateTarget = function(target) {
  return url.parse(this.target).protocol === 'http';
}

/**
 * Launch the actual polling
 *
 * @api public
 */
HttpPoller.prototype.poll = function() {
}

module.exports = HttpPoller;
