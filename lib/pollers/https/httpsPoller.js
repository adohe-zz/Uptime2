var util = require('util'),
    http = require('http'),
    https = require('https'),
    url = require('url'),
    BaseHttpPoller = require('../http/baseHttpPoller');

/**
 * HTTPS Poller, to check web pages or web services served via SSL
 *
 * @param {Mixed} Poller Target (e.g. URL)
 * @param {Number} Poller Timeout in milliseconds.
 * @param {Function} Error/Success callback
 * @api public
 */
function HttpsPoller(target, timeout, callback) {
  HttpsPoller.super_.call(this, target, timeout, callback);
}

util.inherits(HttpsPoller, BaseHttpPoller);

HttpsPoller.type = 'https';

HttpsPoller.validateTarget = function(target) {
  return url.parse(target).protocol === 'https:';
}

module.exports = HttpsPoller;
