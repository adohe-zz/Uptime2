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
  return url.parse(this.target).protocol === 'http:';
}

/**
 * Launch the actual polling
 *
 * @api public
 */
HttpPoller.prototype.poll = function() {
    HttpPoller.super_.prototype.poll.call(this);
    this.request = http.get(this.target, this.onResponseCallback.bind(this));
    this.request.on('error', this.onErrorCallback.bind(this));
}

HttpPoller.prototype.handleRedirectResponse = function(res) {
  var target = url.parse(res.headers.location);
  if(!target.protocol){
    // relative location header. This is incorrect but tolerated
    this.target = url.parse('http://' + this.target.hostname + res.headers.location);
    this.poll();
    return;
  }

  switch(target.protocol){
    case 'http:':
      this.target = target;
      this.poll();
      break;
    case 'https:'
      break;
    default:
      break;
  }
}

module.exports = HttpPoller;
