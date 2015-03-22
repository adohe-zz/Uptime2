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

/**
 * Launch the actual polling
 *
 * @api public
 */
HttpsPoller.prototype.poll = function(secure) {
  HttpsPoller.super_.prototype.poll.call(this);
  var secure = typeof secure !== 'undefined' ? secure : true;
  try {
    if(secure) {
      this.request = https.get(this.target, this.onResponseCallback.bind(this));
    } else {
      this.request = http.get(this.target, this.onResponseCallback.bind(this));
    }
  } catch(err) {
    this.onErrorCallback(err);
  }
  this.request.on('error', this.onErrorCallback.bind(this));
}

/**
 * Handle Redirect Response
 *
 * @api private
 */
HttpsPoller.prototype.handleRedirectResponse = function(res) {
  this.debug(this.getTime() + 'ms Got Redirect Response to ' + res.headers.location);
  var target = url.parse(res.headers.location);
  if(!target.protocol){
    // relative location header. This is incorrect but tolerated
    this.target = url.parse('http://' + this.target.hostname + res.headers.location);
    this.poll(false);
    return;
  }

  switch(target.protocol){
    case 'http:':
      this.target = target;
      this.poll(false);
      break;
    case 'https:':
      this.target = target;
      this.poll(true);
      break;
    default:
      this.request.abort();
      this.onErrorCallback({ name: 'WrongRedirectUrl', message: 'Received redirection from http to unsupported protocol ' +
        target.protocol });
      break;
  }
  return;
}

/*
 * Expose
 */
module.exports = HttpsPoller;
